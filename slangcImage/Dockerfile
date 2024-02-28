FROM ubuntu:latest
ARG LLVM_VERSION=18
# install llvm 18 and clang
RUN  apt-get update \
  && apt-get install -y curl wget lsb-release software-properties-common gnupg git cmake
RUN curl -LO https://apt.llvm.org/llvm.sh
RUN chmod +x llvm.sh
RUN ./llvm.sh 18 llvm clang
RUN ln -s /usr/bin/clang++-$LLVM_VERSION /usr/bin/clang++ \
    && ln -s /usr/bin/clang-$LLVM_VERSION /usr/bin/clang \
    && ln -s /usr/bin/llvm-config-$LLVM_VERSION /usr/bin/llvm-config
ENV CXX=clang++
ENV CC=clang

RUN apt-get install zlib1g zlib1g-dev libzstd-dev -y && rm -rf /var/lib/apt/lists/*

# download and build slangc
RUN git clone https://github.com/f0xeri/SlangCompiler
RUN cd SlangCompiler && cmake -B build -DCMAKE_BUILD_TYPE=Release
RUN cd SlangCompiler && cmake --build build --config Release
RUN chmod +x SlangCompiler/build/slangc
RUN apt remove lsb-release software-properties-common gnupg git cmake llvm-$LLVM_VERSION-tools llvm-$LLVM_VERSION-dev python3 -y
RUN mv SlangCompiler/build/slangc /bin/