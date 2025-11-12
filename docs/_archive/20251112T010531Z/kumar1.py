for i in range(1, 11):
    print(f"Hello, World! {i}")

print("\nFibonacci sequence:")
first, second = 0, 1
for _ in range(10):
    print(first)
    first, second = second, first + second
