
管理専用の投稿を作成することで、あらゆるデータ(投稿、タクソノミー)の一覧を条件検索できます。


## 結果ビュー

![ss-1](https://github.com/user-attachments/assets/510de6f3-6ac7-42c5-aab2-b9e1358ea908)

当プラグインより「結果ビュー」を追加します。


## エンティティの選択

![ss-2](https://github.com/user-attachments/assets/3d76aa44-3bc6-4389-95e2-a2b77946e1f0)

すると右のインスペクターに「KIND」と「NAME」の項目が現れます。


## エンティティでカテゴリを選択


![ss-3](https://github.com/user-attachments/assets/ea9dc8be-d91b-485c-9c19-80e360bb30e0)

「KIND」に`taxonomy`を、「NAME」に`category`を選択すると結果ビューのリストにカテゴリ一覧が表示されます。
もし投稿一覧を表示したければKINDをpostType, NAMEをpostにします。
ページであればKINDをpostType、NAMEをpageにします。

取得したい投稿(カスタム投稿含む)やタクソノミーの一覧を取得できます。


## リストの表示

![ss-4](https://github.com/user-attachments/assets/27755fab-9255-4775-9f85-b5e6d0f5f28a)

カテゴリ一覧が表示されます。


## クエリフォームの追加

![ss-5](https://github.com/user-attachments/assets/d4499699-e1f7-4c34-bc93-6646659ec423)

例えば文字列検索をしたいときはクエリフォームから「テキスト」を選択し、追加します。
するとテキストボックスが現れるので「search」と入力します。

するとどうなるか！

## 検索結果

![ss-6](https://github.com/user-attachments/assets/b12fbcb3-e401-4188-bc53-b846efac4957)

「search」と名付けたクエリフォームに「kura」と入力します。

すると「/wp/v2/categories?search=kura」というURLが作成されています。

これはREST APIに対し、カテゴリ一覧を取得せよ、ただし`kura`という文字列が含まれたものにしぼって！
という内容です。

リストビューを見るとカテゴリが絞られて表示されていることがわかります。

このように、検索文字列を指定する、日付の範囲を指定する、一度に表示する項目数を指定するなどクエリフォームを追加して自在に行えます。

日付入力の場合はテキストボックスではなく日付入力用のダイアログが表示されるようになってます。






