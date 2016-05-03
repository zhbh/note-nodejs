## 学习资料
1. [七天学会NodeJS](http://nqdeng.github.io/7-days-nodejs)
2. [用NodeJS打造你的静态文件服务器](http://www.open-open.com/solution/view/1321344823593)

## 学习思路

### 创建基本http服务器

1. 创建http服务器，并设置监听端口，request获取请求头和请求体的数据对象；

```javascript
	var http = require( 'http' );

	http.createServer( function( request, response ) {

	}.listen( 8080 );
```

	request是请求数据流，包括请求头（headers）和请求体（body）；
	response是响应数据流，包括响应头（headers）和响应体（body）。
	本程序关键获取url相关文件

2. 根据请求链接，得知具体请求的文件；

3. 如果是未知的文件，则返回index.html；

4. 使用本地文件接口，读取相应的文件；

5. 不同文件类型，需要返回不同内容类型相应头（根据文件后缀判断响应内容类型，告诉浏览器展示内容）；

6. 请求文件不存在，则返回提示在服务器找不到相关文件。