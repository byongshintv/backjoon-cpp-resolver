#include <iostream>
using namespace std;
 
int main(int argc, char const *argv[]) {
    int num;
    int result = 0; 
    for(int i = 0; i < 5; i++){
        cin >> num;
        result += num*num; 
    }
    cout << result%10 << endl;
}