#include <iostream>

using namespace std;

 

int main(void)

{

        ios_base::sync_with_stdio(0);

        cin.tie(0);

        int A, B;

        cin >> A >> B;

 

        int result = A * B;

        while (B)

        {

                 cout << B % 10 * A << "\n";

                 B /= 10;

        }

        cout << result << "\n";

        return 0;

}

