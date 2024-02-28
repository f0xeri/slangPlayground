FROM ubuntu:latest
RUN apt update && apt install acl -y
WORKDIR /home/sandbox
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

RUN groupadd -g 1000 -r user && useradd -r -g user -u 1000 user
RUN chown -R user:user /home/sandbox
USER user

ENTRYPOINT ["./entrypoint.sh"]
