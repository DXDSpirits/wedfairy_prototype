$(function() {
	window.TPL = {
		'contact': Mustache.compile('    <header>        <h1>Send your <span class="pink-text">Wishes</span></h1>    </header>    <article class="container">        <p>如果你是他们的微信好友，人人好友，微博好友，还愣在这里干嘛</p>        <p>如果你不是，参与话题发个祝福呗</p>        <h4><a class="pink-text" href="http://huati.weibo.com/k/qidlove">#qidlove</a></h4>        <p>他们没有二维码，也没有手机应用</p>    </article>    <div class="thanks">        <p>感谢 <a class="pink-text" href="http://weibo.com/oatpie">@盒子里的早餐故事</a> 为 <span class="signature pink-text">QiQi &amp; XD</span> 持续供应早餐</p>        <p>感谢 <a class="pink-text" href="http://www.weibo.com/u/3058840707">@美位网</a> 尽管她也没有为 <span class="signature pink-text">QiQi &amp; XD</span> 做什么事情</p>        <p>感谢在过去7年里 <span class="signature pink-text">QiQi &amp; XD</span> 见过的或者没见过的人们</p>    </div>    <p class="copyright">SITE MADE WITH <span class="pink-text">LOVE</span></p>'),
		'goodmorning': Mustache.compile('    <header>        <h1 class="text-center">{{title}}</h1>    </header>'),
		'goodnight': Mustache.compile('    <div id="nightsky">        <div class="nightsky-image"></div>    </div>'),
		'hero': Mustache.compile('    <div class="carousel carousel-in"></div>    <div class="carousel carousel-out"></div>'),
		'honeymoon': Mustache.compile('    <header>        <h1></h1>    </header>'),
		'lavie': Mustache.compile('   <div class="cover">        <div class="cover-top">            <h1 class="title">{{title}}</h1>        </div>        <div class="cover-bottom">            <div class="row">                <div class="col-xs-6">                </div>                <div class="col-xs-6">                    <img src="img/lavie1.jpg" class="img-responsive img-circle">                </div>            </div>        </div>    </div>    <div class="bouquet">        <img src="img/bouquet.png" class="img-responsive">    </div>'),
		'proposal': Mustache.compile('    <div class="rose-cover top"></div>    <div class="rose-cover bottom"></div>'),
		'thebigday': Mustache.compile('    <div class="timeline">        <div class="line"></div>        {{#paragraph}}        <div class="post">            <div class="post-box">                <p>{{content}}</p>            </div>        </div>        {{/paragraph}}    </div>'),
		'thegirl': Mustache.compile('    <div class="shy-girl"></div>    <h3 class="text-center">{{text}}</h3>    <div class="love-cross clearfix">        <div class="img img-the-boy pull-left"></div>        <div class="img img-the-girl pull-left"></div>        <div class="heart"></div>    </div>')
	};
});
