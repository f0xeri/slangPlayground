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
`,
    "Doubly linked list": String.raw`module sample
    public class Node inherits Object
        public field-Node next := nil;
        public field-Node prev := nil;
        public field-integer data;
    end Node;

    public class List inherits Object
        private field-Node head := nil;
        private field-Node tail := nil;

        public method add(List this)(in integer data)
            variable-Node newNode;
            let newNode.data := data;
            if this.head == nil then
                let this.head := newNode;
                let this.tail := newNode;
            else
                let this.tail.next := newNode;
                let newNode.prev := this.tail;
                let this.tail := newNode;
            end if;
        end add;

        public method write(List this)()
            variable-Node current := this.head;
            while current != nil repeat
                output f"{current.data} -> ";
                let current := current.next;
            end while;
            output "nil";
        end write;

        public method destroy(List this)()
            variable-Node current := this.head;
            while current != nil repeat
                variable-Node temp := current.next;
                delete current;
                let current := temp;
            end while;
            let this.head := nil;
            let this.tail := nil;
        end destroy;

        public method insert(List this)(in integer index, in integer data)
            variable-Node newNode;
            let newNode.data := data;
            if index <= 0 then
                let newNode.next := this.head;
                if this.head != nil then
                    let this.head.prev := newNode;
                end if;
                let this.head := newNode;
                if this.tail == nil then
                    let this.tail := newNode;
                end if;
            else
                variable-Node current := this.head;
                variable-integer currentIndex := 0;
                while current != nil repeat
                    let currentIndex := currentIndex + 1;
                    if currentIndex == index then
                        let newNode.next := current.next;
                        let newNode.prev := current;
                        if current.next != nil then
                            let current.next.prev := newNode;
                        end if;
                        let current.next := newNode;
                        if newNode.next == nil then
                            let this.tail := newNode;
                        end if;
                        return;
                    end if;
                    let current := current.next;
                end while;
            end if;
        end insert;

        public method erase(List this)(in integer index)
            if index < 0 then
                return;
            end if;

            variable-Node current := this.head;
            variable-integer currentIndex := 0;

            if index == 0 then
                let this.head := current.next;
                if this.head != nil then
                    let this.head.prev := nil;
                end if;
                delete current;
                return;
            end if;

            while current != nil repeat
                if currentIndex == index then
                    let current.prev.next := current.next;
                    if current.next != nil then
                        let current.next.prev := current.prev;
                    else
                        let this.tail := current.prev;
                    end if;
                    delete current;
                    return;
                end if;
                let current := current.next;
                let currentIndex := currentIndex + 1;
            end while;
        end erase;

    end List;

start
    variable-List list;
    call list.add(1);
    call list.add(2);
    call list.write();
    output "\n";

    call list.insert(1, 3);
    call list.write();
    output "\n";

    call list.insert(0, 0);
    call list.write();
    output "\n";

    call list.insert(4, 4);
    call list.write();
    output "\n";

    call list.erase(1);
    call list.write();
    output "\n";

    call list.erase(0);
    call list.write();
    output "\n";

    call list.erase(2);
    call list.write();
    output "\n";

    call list.destroy();
    delete list;
end sample.
`};