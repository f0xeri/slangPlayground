package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"os"
	"os/exec"
	"strings"
	"time"
)

type Output struct {
	Stdout string `json:"stdout"`
	Stderr string `json:"stderr"`
}

type CompileResponse struct {
	Errors string `json:"errors"`
	Output Output `json:"output"`
}

func randomFileName(length int) string {
	var letters = []byte("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
	var name []byte
	for i := 0; i < length; i++ {
		name = append(name, letters[rand.Intn(len(letters))])
	}
	return string(name)
}

func executeCommand(command string, args ...string) (string, string, error) {
	var outBuffer bytes.Buffer
	var errBuffer bytes.Buffer

	cmd := exec.Command(command, args...)
	cmd.Stdout = &outBuffer
	cmd.Stderr = &errBuffer
	cmd.Start()
	err := cmd.Wait()
	if err != nil {
		log.Printf("Error running command: %s; err: %s; errBuffer: %s; outBuffer: %s", args, err, errBuffer.String(), outBuffer.String())
	}
	if errBuffer.Len() > 0 {
		return "", errBuffer.String(), fmt.Errorf("error: %s", errBuffer.String())
	}
	return outBuffer.String(), errBuffer.String(), nil
}

var SANDBOX_USER_ID = "1000"
var SANDBOX_GROUP_ID = "1000"

func runInSandBox(fileName string) (string, string, error) {
	var outBuffer string
	var errBuffer string
	_, _, err := executeCommand("docker", "create", "--runtime=runsc", "--security-opt=no-new-privileges", "-m", "128m", "-i", "-u", "user:user", "--name", fileName, "sandbox", fmt.Sprintf("%s", fileName))
	// tar | docker cp
	tarCmd := exec.Command("tar", "-cf", "-", fmt.Sprintf("/%s/.", fileName), "--mode", "u=+rwx,g=-rwx,o=-rwx", "--owner", SANDBOX_USER_ID, "--group", SANDBOX_GROUP_ID)
	dockerCmd := exec.Command("docker", "cp", "-", fmt.Sprintf("%s:/home/sandbox/", fileName))

	var tarError bytes.Buffer
	tarCmd.Stderr = &tarError

	dockerCmd.Stdin, _ = tarCmd.StdoutPipe()
	var dockerOutput bytes.Buffer
	var dockerError bytes.Buffer
	dockerCmd.Stdout = &dockerOutput
	dockerCmd.Stderr = &dockerError

	if err := tarCmd.Start(); err != nil {
		log.Printf("Error running command: %s; err: %s; errBuffer: %s; outBuffer: %s", tarCmd, err, tarError.String())
		return outBuffer, "", err
	}
	if err := dockerCmd.Start(); err != nil {
		log.Printf("Error running command: %s; err: %s; errBuffer: %s; outBuffer: %s", dockerCmd, err, dockerError.String(), dockerOutput.String())
		return outBuffer, errBuffer, err
	}
	if err := tarCmd.Wait(); err != nil {
		log.Printf("Error running command: %s; err: %s; errBuffer: %s; outBuffer: %s", tarCmd, err, tarError.String())
		return outBuffer, errBuffer, err
	}
	if err := dockerCmd.Wait(); err != nil {
		log.Printf("Error running command: %s; err: %s; errBuffer: %s; outBuffer: %s", dockerCmd, err, dockerError.String(), dockerOutput.String())
		return outBuffer, errBuffer, err
	}

	outBuffer, errBuffer, err = executeCommand("docker", "start", "-i", fmt.Sprintf("%s", fileName))

	if err != nil {
		return outBuffer, errBuffer, err
	}
	_, _, err = executeCommand("docker", "rm", fmt.Sprintf("%s", fileName))
	return outBuffer, errBuffer, nil
}

func compile(w http.ResponseWriter, r *http.Request) {
	compileResponse := CompileResponse{}
	w.Header().Set("Content-Type", "application/json")
	requestBody, err := io.ReadAll(r.Body)
	requestBody = bytes.ReplaceAll(requestBody, []byte("\r\n"), []byte("\n"))
	if err != nil || len(requestBody) == 0 {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Println(err)
		return
	}
	fileName := randomFileName(10)
	fullFileName := fileName + "/" + fileName
	// write source code to file
	os.Mkdir(fileName, 0644)
	err = os.WriteFile(fullFileName+".sl", requestBody, 0644)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Println(err)
		return
	}
	ctx := context.Background()

	var cancel context.CancelFunc
	ctx, cancel = context.WithTimeout(context.Background(), time.Duration(10)*time.Second)
	defer cancel()
	cmd := exec.CommandContext(ctx, "slangc", fullFileName+".sl", "-o", fullFileName+".out")
	out := &bytes.Buffer{}
	cmd.Stdout, cmd.Stderr = out, out
	if err := cmd.Run(); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		compileResponse.Errors = strings.ReplaceAll(out.String(), fullFileName, "main")
		compileResponse.Output = Output{Stdout: "", Stderr: "\n\nBuild failed\n"}
		json.NewEncoder(w).Encode(compileResponse)
		log.Printf("Error running compiler: %s; err: %s", out.String(), err)
		return
	}

	log.Println(out.String())
	runResult, runErrors, err := runInSandBox(fileName)
	log.Println(runResult)
	log.Println(runErrors)
	os.RemoveAll(fileName)
	compileResponse.Errors = strings.ReplaceAll(out.String(), fullFileName, "main")
	compileResponse.Output = Output{Stdout: runResult, Stderr: runErrors}
	json.NewEncoder(w).Encode(compileResponse)
	if err != nil {
		w.WriteHeader(http.StatusOK)
		log.Println(err)
		return
	}
}

func main() {
	http.HandleFunc("/compile", compile)
	http.ListenAndServe(":6002", nil)
}
