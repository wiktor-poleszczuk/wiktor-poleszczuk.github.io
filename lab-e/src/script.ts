const msg: string = "Hello!";
alert(msg);

const link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'public/style-1.css';

document.getElementsByTagName('head')[0].appendChild(link);
