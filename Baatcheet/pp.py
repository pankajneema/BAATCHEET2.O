tests = int(input())
while (tests > 0):
    word = input()
    lengt = 0
    for i in word:
        lengt = lengt + 1
    
    if lengt > 10:
        print(f"{word[0]}{lengt-2}{word[lengt-1]}")
    else:
        print(f"{word}")
    print(tests)
    tests = tests -1 
