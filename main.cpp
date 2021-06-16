#include <stdio.h>
 
int main(int argc, char const *argv[]) {
    
    int A;
    int B;
 
    scanf("%d", &A);
    scanf("%d", &B);
 
    // scanf("%d %d", &A, &B); 로 바꾸어도 무방
   
    printf("%d", A + B);
    return 0;
}