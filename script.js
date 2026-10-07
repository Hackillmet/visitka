(function(){
  var root=document.documentElement;
  var COL=['--red','--orange','--yellow','--green','--teal','--blue','--violet'];
  var css=function(n){return getComputedStyle(root).getPropertyValue(n).trim()};
  var clr=function(a){a.animatables.forEach(function(x){x.target.style.transform=''})};
  var ok=!!window.anime && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(ok) root.classList.add('js');

  // name letters
  var nameEl=document.getElementById('name'), word='MakwinIT';
  word.split('').forEach(function(ch,i){
    var s=document.createElement('span'); s.textContent=ch;
    nameEl.appendChild(s);
  });

  // dot grid
  var grid=document.getElementById('grid');
  var cols=innerWidth<640?9:18, rows=innerWidth<640?14:9;
  grid.style.gridTemplateColumns='repeat('+cols+',auto)';
  for(var i=0;i<cols*rows;i++){
    var b=document.createElement('b');
    
    grid.appendChild(b);
  }
  var dots=[].slice.call(grid.querySelectorAll('b::after'.length?'b':'b'));

  function wave(from){
    if(!ok) return;
    anime({
      targets:grid.children,
      scale:[{value:2.4,duration:200,easing:'easeOutSine'},{value:1,duration:500,easing:'easeInOutQuad'}],
      translateY:[{value:-10,duration:200},{value:0,duration:500}],
      color:[{value:['rgb(0,90,105)','rgb(0,229,255)'],duration:200},{value:['rgb(0,229,255)','rgb(0,90,105)'],duration:500}],
      delay:anime.stagger(55,{grid:[cols,rows],from:from})
    });
  }
  grid.addEventListener('click',function(e){
    var t=e.target.closest('b'); if(!t) return;
    wave([].indexOf.call(grid.children,t));
  });

  if(ok){
    anime.timeline({easing:'easeOutExpo'})
      .add({targets:['#hero .pill','#hero .hi'],opacity:[0,1],translateY:[16,0],duration:700,delay:1650})
      .add({targets:'#name span',translateY:[80,0],opacity:[0,1],rotate:[8,0],duration:1100,delay:anime.stagger(70)},'-=400')
      .add({targets:['#hero .lead','#hero .btns','#hero .hint'],opacity:[0,1],translateY:[20,0],duration:800,delay:anime.stagger(120)},'-=700')
      .add({targets:'#hero .code',opacity:[0,1],translateX:[50,0],duration:900},'-=1500')
      .add({targets:'#hero .code .ln',opacity:[0,1],translateX:[-14,0],delay:anime.stagger(120),duration:600},'-=500')
      .add({duration:1,complete:function(){wave('center');}},'-=300');
    setInterval(function(){ if(scrollY<innerHeight/2) wave('center'); },8000);

    document.querySelectorAll('[data-n]').forEach(function(el){el.textContent='0'});
    var seen=new WeakSet();
    var rio=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting||seen.has(e.target)) return;
        seen.add(e.target);if(e.target.id==='data')draw();
        var FX={road:{translateX:[-50,0]},skills:{scale:[.7,1],rotate:[-5,0]},data:{translateY:[70,0]},projects:{translateY:[50,0],rotate:[2,0]},contacts:{translateX:[70,0]}};
        anime(Object.assign({targets:e.target.querySelectorAll('.rv'),opacity:[0,1],translateY:[30,0],scale:[.96,1],delay:anime.stagger(90),duration:900,easing:'easeOutExpo',complete:clr},FX[e.target.id]||{}));
        var hh=e.target.querySelector('h2');
        if(hh)anime({targets:hh,clipPath:['inset(0 100% 0 0)','inset(0 -2% 0 0)'],duration:1000,easing:'easeInOutQuart',complete:function(){hh.style.clipPath=''}});
        e.target.querySelectorAll('[data-n]').forEach(function(el){var o={v:0};anime({targets:o,v:+el.dataset.n,round:1,duration:1800,delay:300,easing:'easeOutExpo',update:function(){el.textContent=o.v}})});
      });
    },{threshold:.25});
    document.querySelectorAll('section:not(#hero)').forEach(function(s){rio.observe(s)});
  }

  // marquee
  var tr=document.getElementById('tr'); tr.innerHTML+=tr.innerHTML;
  // typing roles
  var R=['Python-разработчик','Веб-вёрстка и анимации','Дизайнер интерфейсов в Figma','Монтаж видео','Блогер про IT'],ri=0,ci=0,dl=false,re=document.getElementById('role');
  function tp(){var w=R[ri];ci+=dl?-1:1;re.textContent=w.slice(0,ci);var t=dl?35:70;
    if(!dl&&ci===w.length){dl=true;t=1400}else if(dl&&ci===0){dl=false;ri=(ri+1)%R.length;t=300}setTimeout(tp,t)}
  if(ok) tp(); else re.textContent=R.join(' · ');
  // scroll progress, glow, card spotlight
  var pg=document.getElementById('pg');
  addEventListener('scroll',function(){var h=root.scrollHeight-innerHeight;pg.style.transform='scaleX('+(h>0?scrollY/h:0)+')'},{passive:true});
  addEventListener('pointermove',function(e){
    
    var c=e.target.closest&&e.target.closest('.sk,.pr,.ct');
    if(c){var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')}
  },{passive:true});
  // project filter
  var chips=[].slice.call(document.querySelectorAll('.chip'));
  chips.forEach(function(c){c.addEventListener('click',function(){
    chips.forEach(function(x){x.setAttribute('aria-pressed',x===c)});
    document.querySelectorAll('.pr').forEach(function(p){p.classList.toggle('hide',c.dataset.f!=='all'&&p.dataset.t!==c.dataset.f)});
    if(ok) anime({targets:'.pr:not(.hide)',opacity:[0,1],translateY:[24,0],scale:[.94,1],delay:anime.stagger(80),duration:700,easing:'easeOutExpo',complete:clr});
  })});

  var P={
    shirt:{t:'NIGHT 01: сайт для футболок',c:'--violet',tags:['Интернет-магазин','Тёмный стиль','Фото товара'],d:'Магазин футболок со своим принтом: фото на модели, спина с горным принтом и плоская раскладка товара.',im:IMG.shirt},
    yuan:{t:'Гостевой дом «Юань» в Голубицкой',c:'--teal',tags:['Сайт гостевого дома','Адаптивная вёрстка','Анимации при прокрутке'],d:'Сайт дома у Азовского моря: три студии с фото, удобства, отзывы с Яндекс.Карт и быстрая связь через Telegram и телефон.',im:IMG.yuan},
    coffee:{t:'Florista: кофейня в Калуге',c:'--orange',tags:['Сайт кофейни','Меню','Калькулятор напитка'],d:'Сайт кофейни в центре Калуги: меню из четырёх категорий, блок «От зерна до чашки», калькулятор напитка, отзывы, карта и частые вопросы.',im:[]},
    rb:{t:'Сайт Red Bull',c:'--red',tags:['Лендинг','Анимации при прокрутке','Корзина'],d:'Рекламный лендинг: вкусы Sugarfree и Peach, анимированная сборка состава, гоночный болид, счётчики в цифрах и кнопка «Добавить в корзину».',im:IMG.rb},
    ff:{t:'FocusFlow: трекер дисциплины в Telegram',c:'--green',tags:['Telegram Mini App','RU / EN','Тёмная и светлая тема'],d:'Личный трекер продуктивности: заметки, календарь активности, задачи, таймер занятий и статистика за неделю. Есть русский и английский язык, тёмная и светлая тема. Работает внутри Telegram.',im:[],u:'https://hackillmet.github.io/focusflow/'}
  };
  var cv={shirt:IMG.shirt[1],yuan:IMG.yuan[0]};
  Object.keys(cv).forEach(function(k){var a=document.querySelector('.pr[data-k="'+k+'"] .art');a.style.backgroundImage='url('+cv[k]+')';a.classList.add('ph')});
  var ra=document.querySelector('.pr[data-k="rb"] .art');ra.innerHTML=IMG.rb.map(function(s){return'<img alt="" src="'+s+'">'}).join('');ra.classList.add('rba');
  var md=document.getElementById('md'),mp=document.getElementById('mp'),mx=document.getElementById('mx'),lastF=null;
  function openM(k){var p=P[k];lastF=document.activeElement;mp.style.setProperty('--c','var('+p.c+')');
    document.getElementById('mtt').textContent=p.t;document.getElementById('mds').textContent=p.d;
    document.getElementById('mtg').innerHTML=p.tags.map(function(t){return'<span>'+t+'</span>'}).join('');
    var lk=document.getElementById('mlk');lk.hidden=!p.u;if(p.u){lk.href=p.u;lk.textContent='Открыть приложение'}
    document.getElementById('gal').innerHTML=p.im.map(function(s){return'<img alt="" src="'+s+'">'}).join('');
    md.hidden=false;root.style.overflow='hidden';mx.focus();
    if(ok){anime({targets:md,opacity:[0,1],duration:250,easing:'linear'});
      anime({targets:mp,translateY:[50,0],scale:[.94,1],opacity:[0,1],duration:700,easing:'easeOutExpo'});
      anime({targets:'#gal img',translateX:[80,0],opacity:[0,1],delay:anime.stagger(90,{start:200}),duration:800,easing:'easeOutExpo'})}}
  function closeM(){if(md.hidden)return;var f=function(){md.hidden=true;root.style.overflow='';if(lastF)lastF.focus()};
    if(ok)anime({targets:md,opacity:0,duration:220,easing:'linear',complete:f});else f()}
  document.querySelectorAll('.pr').forEach(function(c){
    c.addEventListener('click',function(){openM(c.dataset.k)});
    c.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openM(c.dataset.k)}})});
  mx.addEventListener('click',closeM);
  md.addEventListener('click',function(e){if(e.target===md)closeM()});
  addEventListener('keydown',function(e){if(e.key==='Escape')closeM()});

  // ring ticks, intro, drag, roadmap line
  function mk(el,n){for(var i=0;i<n;i++){var t=document.createElement('i');t.style.transform='rotate('+(i*360/n)+'deg)';el.appendChild(t)}}
  var lr=document.getElementById('lr'),br=document.getElementById('br');
  mk(lr,60);mk(br,40);
  if(ok){
    anime.timeline({easing:'easeInOutQuad'})
      .add({targets:'#lr i',opacity:[0,1],delay:anime.stagger(14),duration:300},0)
      .add({targets:lr,rotate:360,duration:1500},0)
      .add({targets:'.ldn',opacity:[0,1],duration:500},300)
      .add({targets:'#ld',opacity:0,duration:450,easing:'linear',complete:function(){var l=document.getElementById('ld');if(l)l.remove()}},1500);
    anime({targets:br,rotate:360,duration:9000,easing:'linear',loop:true});
  }
  function drag(el){
    var sx=0,sy=0,dx=0,dy=0,on=false;
    el.addEventListener('pointerdown',function(e){on=true;sx=e.clientX-dx;sy=e.clientY-dy;el.setPointerCapture(e.pointerId);el.style.zIndex=6;el.style.cursor='grabbing';anime.remove(el)});
    el.addEventListener('pointermove',function(e){if(!on)return;dx=e.clientX-sx;dy=e.clientY-sy;el.style.transform='translate('+dx+'px,'+dy+'px) rotate('+(dx/25).toFixed(1)+'deg)'});
    var up=function(){if(!on)return;on=false;el.style.cursor='';
      anime({targets:el,translateX:[dx,0],translateY:[dy,0],rotate:[dx/25,0],duration:1500,easing:'easeOutElastic(1,.45)',complete:function(){dx=dy=0;el.style.transform='';el.style.zIndex=''}})};
    el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
  }
  if(window.anime){drag(document.getElementById('ball'));document.querySelectorAll('.sk').forEach(drag)}
  var rdEl=document.querySelector('.road'),rds=[].slice.call(document.querySelectorAll('.rd')),rt=false;
  function rl(){rt=false;var r=rdEl.getBoundingClientRect(),y=innerHeight*.7;
    rdEl.style.setProperty('--p',Math.max(0,Math.min(1,(y-r.top)/r.height)).toFixed(3));
    rds.forEach(function(d){d.classList.toggle('on',d.getBoundingClientRect().top<y)})}
  addEventListener('scroll',function(){if(!rt){rt=true;requestAnimationFrame(rl)}},{passive:true});rl();

  // charts
  var LV=[['Python',70],['HTML',80],['CSS',75],['JS',60],['Figma',65],['Монтаж',55]];
  var AD=[5,9,14,20,28,35,44,52,63,72,83,95];
  function pt(i,v,t){var a=-Math.PI/2+i*Math.PI/3,r=110*v/100*t;return[(150+r*Math.cos(a)).toFixed(1),(150+r*Math.sin(a)).toFixed(1)]}
  var g='';[25,50,75,100].forEach(function(l){g+='<polygon class="gl" points="'+LV.map(function(_,i){return pt(i,l,1)}).join(' ')+'"/>'});
  LV.forEach(function(d,i){var p=pt(i,100,1),q=pt(i,118,1);g+='<line class="gl" x1="150" y1="150" x2="'+p[0]+'" y2="'+p[1]+'"/><text x="'+q[0]+'" y="'+(+q[1]+4)+'" text-anchor="middle">'+d[0]+'</text>'});
  document.getElementById('radar').insertAdjacentHTML('afterbegin',g);
  var rp=document.getElementById('rpoly'),r1=document.getElementById('r1'),r2=document.getElementById('r2'),acl=document.getElementById('acl'),C=2*Math.PI*70;
  function setC(t){rp.setAttribute('points',LV.map(function(d,i){return pt(i,d[1],t)}).join(' '));
    r1.setAttribute('stroke-dasharray',(.8*C-4)*t+' '+C);r2.setAttribute('stroke-dasharray',(.2*C-4)*t+' '+C);acl.setAttribute('width',400*t)}
  var ax=function(i){return 20+i*360/11},ay=function(v){return 170-v*1.5};
  var gl='';[0,25,50,75,100].forEach(function(v){gl+='<line class="gl" x1="20" x2="380" y1="'+ay(v)+'" y2="'+ay(v)+'"/>'});
  [0,5,11].forEach(function(i){gl+='<text x="'+ax(i)+'" y="190" text-anchor="middle">М'+(i+1)+'</text>'});
  document.getElementById('agrid').innerHTML=gl;
  var ln=AD.map(function(v,i){return(i?'L':'M')+ax(i).toFixed(1)+' '+ay(v)}).join(' ');
  document.getElementById('aln').setAttribute('d',ln);
  document.getElementById('aar').setAttribute('d',ln+' L380 170 L20 170Z');
  setC(ok?0:1);
  function draw(){var o={t:0};anime({targets:o,t:1,duration:1800,delay:300,easing:'easeOutExpo',update:function(){setC(o.t)}})}
  var ach=document.getElementById('ach'),acx=document.getElementById('acx'),acd=document.getElementById('acd'),ro=document.getElementById('ro');
  ach.addEventListener('pointermove',function(e){var b=ach.getBoundingClientRect(),x=(e.clientX-b.left)/b.width*400;
    var i=Math.max(0,Math.min(11,Math.round((x-20)*11/360)));
    acx.setAttribute('x1',ax(i));acx.setAttribute('x2',ax(i));acd.setAttribute('cx',ax(i));acd.setAttribute('cy',ay(AD[i]));
    acx.setAttribute('opacity',1);acd.setAttribute('opacity',1);ro.textContent='Месяц '+(i+1)+': уровень '+AD[i]+' из 100'});
  ach.addEventListener('pointerleave',function(){acx.setAttribute('opacity',0);acd.setAttribute('opacity',0);ro.textContent='Наведи на график'});

  // page transition curtain
  var cur=document.getElementById('cur');
  COL.forEach(function(c,i){var d=document.createElement('i');d.style.background=i%2?'#00c4dd':'#00e5ff';cur.appendChild(d)});
  var bars=cur.children;
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href^="#"]');if(!a||!ok)return;
    var t=document.querySelector(a.getAttribute('href'));if(!t)return;e.preventDefault();
    anime.timeline({easing:'easeInOutQuart'})
      .add({targets:bars,scaleY:[0,1],duration:420,delay:anime.stagger(45)})
      .add({duration:1,complete:function(){root.style.scrollBehavior='auto';t.scrollIntoView();root.style.scrollBehavior='';
        [].forEach.call(bars,function(b){b.style.transformOrigin='50% 0'})}})
      .add({targets:bars,scaleY:0,duration:420,delay:anime.stagger(45),complete:function(){[].forEach.call(bars,function(b){b.style.transformOrigin='50% 100%'})}});
  });
  // parallax ghost titles
  var gs=[].slice.call(document.querySelectorAll('section[data-g]'));
  addEventListener('scroll',function(){gs.forEach(function(s){var r=s.getBoundingClientRect();s.style.setProperty('--px',(r.top/innerHeight*-14).toFixed(1)+'vw')})},{passive:true});

  // scroll-linked section transitions
  if(ok){
    var wr=[].slice.call(document.querySelectorAll('section .wrap')),tk=false;
    var lk=function(){tk=false;var h=innerHeight;wr.forEach(function(w){
      var r=w.parentNode.getBoundingClientRect(),a=Math.max(Math.min(1,Math.max(0,r.top/h)*1.1),Math.min(1,Math.max(0,1-r.bottom/h)*1.1));
      if(w.parentNode.id==='hero')a=Math.min(1,Math.max(0,1-r.bottom/h)*1.1);
      w.style.transform=a?'scale('+(1-a*.06).toFixed(3)+') translateY('+(a*(r.top>0?30:-30)).toFixed(0)+'px)':'';
      w.style.opacity=a?(1-a*.65).toFixed(2):''})};
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(lk)}},{passive:true});
  }

  // race track: car follows the scroll
  var tp=document.getElementById('tp'),td=document.getElementById('td'),car=document.getElementById('car'),cl=document.getElementById('cl'),TL=0,ct,tt=false;
  var FL={hero:'СТАРТ',road:'ПУТЬ',skills:'НАВЫКИ',data:'ГРАФИКИ',projects:'ПРОЕКТЫ',contacts:'ФИНИШ'};
  function flag(id){cl.textContent=FL[id]||'';cl.classList.add('show');clearTimeout(ct);ct=setTimeout(function(){cl.classList.remove('show')},1600)}
  function mv(){try{
    var m=root.scrollHeight-innerHeight,p=m>0?Math.min(1,scrollY/m):0,L=TL*p;
    var a=tp.getPointAtLength(L),b=tp.getPointAtLength(Math.min(TL,L+2)),c=tp.getPointAtLength(Math.max(0,L-2));
    td.style.strokeDasharray=L+' '+TL;
    car.setAttribute('transform','translate('+a.x+' '+a.y+') rotate('+(Math.atan2(b.y-c.y,b.x-c.x)*180/Math.PI+90)+')');
    cl.setAttribute('x',a.x+14);cl.setAttribute('y',a.y+4);
  }catch(e){}}
  function trk(){try{
    var H=innerHeight,n=6,h=H/n,d='M30 0';
    for(var i=0;i<n;i++){var a=i%2?6:54,b=i%2?54:6;d+=' C'+a+' '+(i*h+h*.3)+' '+b+' '+(i*h+h*.7)+' 30 '+((i+1)*h)}
    tp.setAttribute('d',d);td.setAttribute('d',d);TL=tp.getTotalLength();mv();
  }catch(e){}}
  addEventListener('scroll',function(){if(!tt){tt=true;requestAnimationFrame(function(){tt=false;mv()})}},{passive:true});
  addEventListener('resize',trk);trk();

  // active nav + accent
  var links=[].slice.call(document.querySelectorAll('nav.dots a'));
  var nio=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)});
      root.style.setProperty('--acc','var('+e.target.dataset.acc+')');flag(e.target.id);
    });
  },{threshold:.55});
  document.querySelectorAll('section').forEach(function(s){nio.observe(s)});
})();
