#include <iostream>
using namespace std;
int main(void){

    int a, b,c;
    long long result;
    int arr[10] = {0,};
    cin >> a >> b >> c;
    result = a*b*c;

    while(result > 0){
        arr[result % 10]++;
        result /= 10;
    }

    for(int i = 0; i < 10; i++){
        cout << arr[i] << endl;
    }

        return 1;
}

