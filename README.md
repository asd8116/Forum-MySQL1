# 餐廳評論網

一個使用 Node.js/Express + MySQL 打造的美食餐廳評論網站，有眾多網友的分析與評論，以及人氣餐廳的排行，讓您找到心目中適宜的店家。

[Demo Website](https://forum-express-zenyi2.herokuapp.com)

測試帳密登入：

```
管理員
  帳號：root@example.com
  密碼：12345678
```

## Picture

![image](https://i.imgur.com/Xp6VFKI.jpg)

![image](https://i.imgur.com/vWi0Lqz.jpg)

![image](https://i.imgur.com/w7nnHiR.jpg)

![image](https://i.imgur.com/f9yUm8X.jpg)

## Features

####前台

1. 使用者可以註冊/登入/登出網站，並依據狀況出現提示訊息
2. 使用者可以瀏覽所有餐廳，並用分類進行篩選
3. 使用者可以瀏覽個別餐廳詳細資料
4. 使用者可以對餐廳留下評論
5. 使用者可以收藏餐廳
6. 使用者可以查看最新的 10 筆餐廳 & 10 筆評論
7. 使用者可以追蹤其他的使用者
8. 使用者可以編輯自己的個人資料
9. 使用者可以查看自己評論過 & 收藏過的餐廳
10. 使用者可以查看自己追蹤中的使用者 & 正在追蹤自己的使用者

####後台

1. 只有網站管理者可以登入網站後台
2. 管理者可以在後台管理餐廳的基本資料
3. 管理者可以在後台管理餐廳分類
4. 管理者可以在後台設定使用著權限

## Environment SetUp

- [MySQL](https://downloads.mysql.com/archives/) - Database

* [Node.js](https://nodejs.org/en/) - JavaScript runtime built

- [Express](https://expressjs.com/zh-tw/starter/installing.html) - Node.js web framework

## Installing

啟動 MySQL 資料庫，開啟終端機並下載專案

```
git clone https://github.com/asd8116/Forum-MySQL1.git
```

從終端機導入目標檔案，並下載工具包

```
npm install
```

透過 MySQL Workbench 建立本機資料庫

```
CREATE DATABASE forum;
```

從終端機將資料模板導入至 MySQL

```
npx sequelize-cli db:migrate
```

從終端機導入種子資料

```
npx sequelize-cli db:seed:all
```

開啟本地伺服器。

```
node app.js
```

成功連結後，瀏覽器輸入 http://localhost:3000
網頁即可運行，並可使用種子資料帳密執行操作。

## Contributor

[馬振壹 Wanaka](https://github.com/asd8116)
