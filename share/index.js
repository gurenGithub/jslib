

var xShare=(function(){

	var member={
		qqZone:function(){
			 var qzones= document.getElementsByClassName('qzone');
			 if(!qzones){return;}


               for (var i = 0; i < qzones.length; i++) {
               	
               	     (function(i){
               	     	var qzone=qzones[i];
                 var title=qzone.getAttribute('stitle');
			 var desc=qzone.getAttribute('desc');
			 var url=qzone.getAttribute('url');
			 var pas={
			 	title:title,
			 	url:encodeURIComponent(url|| document.location.href|| 'www.qq.com'),
			 	desc:desc
			 }
			 var _pas=[];
			 for (var item in pas){
			 	_pas.push(item+'='+pas[item])
			 }
			 qzone.setAttribute('href','http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?'+(_pas.join('&')));
			 qzone.setAttribute('target','_blank')
			 qzone.setAttribute('title','分享到QQ空间')

               	     })(i)
               }
			 
		},
		pengyou:function(){

			http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?to=pengyou

			 var pengyous= document.getElementsByClassName('pengyou');
			 if(!pengyous){return;}


               for (var i = 0; i < pengyous.length; i++) {
               	
               	     (function(i){
               	     	var pengyou=pengyous[i];
                 var title=pengyou.getAttribute('stitle');
			 var desc=pengyou.getAttribute('desc');
			 var url=pengyou.getAttribute('url');
			 var pas={
			 	title:title,
			 	url:encodeURIComponent(url|| document.location.href|| 'www.qq.com'),
			 	desc:desc
			 }
			 var _pas=[];
			 for (var item in pas){
			 	_pas.push(item+'='+pas[item])
			 }
			 pengyou.setAttribute('href','http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?to=pengyou&'+(_pas.join('&')));
			 pengyou.setAttribute('target','_blank')
			 pengyou.setAttribute('title','分享到朋友圈')

               	     })(i)
               }
			 
		},
		sina:function(){

			http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?to=pengyou

			 var sinas= document.getElementsByClassName('sina');
			 if(!sinas){return;}


               for (var i = 0; i < sinas.length; i++) {
               	
               	     (function(i){
               	     	var sina=sinas[i];
                 var title=sina.getAttribute('stitle');
			 var desc=sina.getAttribute('desc');
			 var url=sina.getAttribute('url');
			 var pas={
			 	
			 	url:encodeURIComponent(url|| document.location.href|| 'www.qq.com'),
			 	title:desc
			 }
			 var _pas=[];
			 for (var item in pas){
			 	_pas.push(item+'='+pas[item])
			 }
			 sina.setAttribute('href','http://v.t.sina.com.cn/share/share.php?'+(_pas.join('&')));
			 sina.setAttribute('target','_blank')
			 sina.setAttribute('title','分享到新浪微博')

               	     })(i)
               }
			 
		},
		render:function(){
			this.qqZone();
			this.pengyou();
			this.sina();
		}
	}
	return member;
})()


xUtils.addEvent(window, 'load', function() 
 {
    xShare.render()
 });
 