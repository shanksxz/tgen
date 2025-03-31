#include <bits/stdc++.h>
using namespace std;

int maxPartitions(string s) {
  vector<int> freq(26, 0);
  int count = 0;
  for (int i = 0; i < s.size(); i++) {
    freq[s[i] - 'a']++;
    int flag = 1;
    for (int j = i + 1; j < s.size(); j++) {
      if (freq[s[j] - 'a'] > 0) {
        flag = 0;
      }
    }
    if (flag) {
      for (int i = 0; i < 26; i++) {
        freq[i] = 0;
      }
      count++;
    }
  }
  return count;
}

int main() { cout << maxPartitions("acbbcc"); }
