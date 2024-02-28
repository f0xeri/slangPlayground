FROM golang:latest as builder
WORKDIR /go/src/app
COPY . ./
RUN go mod download
RUN go build -o slangcRunner

FROM slangc-image:latest
RUN apt update && apt install -y --no-install-recommends docker.io
COPY --from=builder /go/src/app/slangcRunner .
EXPOSE 6002
CMD ["./slangcRunner"]

# bash -c "printf 'module test\nstart\n    output \"Hello\";\nend test.\n' >> test.sl"
# docker exec slangc-runner slangc test.sl