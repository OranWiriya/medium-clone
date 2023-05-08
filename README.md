## Medium-clone full-stack project app
เป็นโปรเจคฝึกฝนแบบ full-stack โดยที่เขียนด้วย React โดยใช้ Vite เป็น Build-tool ในการสร้างหน้าเว็ปแอป และ มีการจัดการงาน Backend ด้วย Sequelize, Express.js ทำงานร่วมกับ Database MySQL  แล้วเชื่อมโยง frontend - backend ด้วย axios และตกแต่งหน้าเว็บไซต์ด้วย Tailwind ร่วมไปถึงมีระบบการตรวจสอบตัวตน Authentication ด้วย jason-web-token ผ่าน passport.js

*inspire by Realworld project app*

## Tech stack

 - Vite.React 18.2.0
 - Express.js 4.18.2
 - Sequelize 6.31.0
 - MySQL 3.2.3
 - TailwindCSS 3.3.1
 - Axios 1.3.5

## ขั้นตอนการติดตั้ง

**Frontend**

	cd medium-clone
    npm init
    npm run dev

**backend**

	cd medium-clone/backend
    nodemon server.js

## เป้าหมายที่ตั้งไว้สำหรับโปรแกรม

 - [x] Authenticate users ด้วย Jason-Web-Token
 - [x] CRU- user 
	 - [x] รองรับการแก้ไข Username, Firstname, Lastname, Bio, Image, Email
 - [x] CRUD Articles 
	 - [x] content ต่างๆภายใน article นั้นจะแสดงในรูปแบบ Markdown
 - [x] CR-D Comments 
 - [x] Category tags for classify articles  
 - [x] Favorite articles 
 - [x] Following users
 - [x] ดึงข้อมูลต่างๆ นำมาโชว์ที่หน้าเว็บได้ 
	 - [x] มีการเรียง articles จากใหม่ - เก่า
	 - [x] มีการเรียง pagination list of articles โดยแสดงหน้าละ 3 articles
	 - [x] สามารถเลือกแสดงเฉพาะ articles ตาม tags 
	 - [x] สามารถเลือกดูแค่ article เดียวได้
	 - [x] สามารถเลือกดูเฉพาะ article ที่เขียนโดย user ที่เรา following อยู่ได้
	 - [x] สามารถเลือกดูเฉพาะ article ที่กด favorite ได้ 
	 - [x] สามารถเลือกดูเฉพาะ article ที่เราเขียนได้

## Develop by
Oran W. - Software Developer 
