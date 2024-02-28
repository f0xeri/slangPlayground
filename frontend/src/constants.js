// load code snippets from files in examples folder



export const CODE_SNIPPETS = {
    "Hello, World!": `module test\nstart\n    output "Hello, World!\\n";\nend test.\n`,
    "Inheritance": String.raw`module sample
    public class A inherits Object
        public field-integer i := 10;
        public virtual method foo(A a)()
            output "A::foo called\n";
        end foo;
        public virtual method foo(A a)(in integer x)
            output "A::foo(in integer) called\n";
        end foo;
        public method bar(A a)()
            output "A::bar called\n";
        end bar;
    end A;
    public class B inherits A
        public virtual method foo(B b)()
            output "B::foo called\n";
        end foo;
        public method bar(B b)()
            output "B::bar called\n";
        end bar;
    end B;
start
    variable-A a;
    variable-B b;
    variable-A a2;
    variable-B b2;
    variable-array[5] A arr;
    let arr[0] := a;
    let arr[1] := b;
    let arr[2] := b2;
    let arr[3] := a2;
    let arr[4] := a;
    variable-integer i := 0;
    while i < 5 repeat
        call arr[i].foo();
        call arr[i].bar();
        let arr[i].i := i;
        output arr[i].i;
        let i := i + 1;
    end while;
end sample.`,
    "Function overloading": String.raw`module funcOverloading
    private function add(in integer a, in integer b): integer
        return a + b;
    end add;

    private function add(in integer a, in integer b, in integer c): integer
        return a + b + c;
    end add;

    private function add(in real a, in real b): real
        return a + b;
    end add;

    private function add(in real a, in real b, in real c): real
        return a + b + c;
    end add;

    private class TestClass inherits Object
        public method add(TestClass this)(in integer a, in integer b): integer
            return a + b;
        end add;

        public method add(TestClass this)(in integer a, in integer b, in integer c): integer
            return a + b + c;
        end add;

        public method add(TestClass this)(in real a, in real b): real
            return a + b;
        end add;

        public method add(TestClass this)(in real a, in real b, in real c): real
            return a + b + c;
        end add;
    end TestClass;
start
    variable-integer a := 1;
    variable-integer b := 2;
    variable-integer c := 3;
    variable-real ar := 1.1;
    variable-real br := 2.2;
    variable-real cr := 3.3;
    output "a + b = ";
    output add(a, b);
    output "\n";
    output "a + b + c = ";
    output add(a, b, c);
    output "\n";
    output "ar + br = ";
    output add(ar, br);
    output "\n";
    output "ar + br + cr = ";
    output add(ar, br, cr);
    output "\n";
    output "a + br = ";
    output add(a, br);
    output "\n";
    output "ar + b = ";
    output add(ar, b);
    output "\n";
    output "ar + b + c = ";
    output add(a, br, cr);
    output "\n";
    output "a + b + cr = ";
    output add(ar, b, c);
    output "\n";

    variable-TestClass tc;
    output "tc.add(a, b) = ";
    output tc.add(a, b);
    output "\n";
    output "tc.add(a, b, c) = ";
    output tc.add(a, b, c);
    output "\n";
    output "tc.add(ar, br) = ";
    output tc.add(ar, br);
    output "\n";
    output "tc.add(ar, br, cr) = ";
    output tc.add(ar, br, cr);
    output "\n";
    output "tc.add(a, br) = ";
    output tc.add(a, br);
    output "\n";
    output "tc.add(ar, b) = ";
    output tc.add(ar, b);
    output "\n";
    output "tc.add(ar, b, c) = ";
    output tc.add(ar, b, c);
    output "\n";
    output "tc.add(a, b, cr) = ";
    output tc.add(a, b, cr);
    output "\n";
end funcOverloading.
`
};