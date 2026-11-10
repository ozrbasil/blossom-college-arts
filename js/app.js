const CATS=["Alpha Zone","Core Zone","Prime Zone","General"],PTS=[5,3,1];
const SEED={date:"2026-10-10T09:00",houses:[],comps:[],gallery:[]};
const stEl=document.getElementById("st");let S0=null;try{S0=JSON.parse((stEl&&stEl.textContent)||"null")}catch(e){}const REMOTE=true;let S=Object.assign(JSON.parse(JSON.stringify(SEED)),S0||{});delete S.pass;S.houses=S.houses||[];S.comps=S.comps||[];S.gallery=S.gallery||[];S.parts=S.parts||[];S.tpl=S.tpl||1;S.tplOn=S.tplOn||[true,true,true];S.tplBg=S.tplBg||[null,null,null];const OLD={name:"EVENT EUPHORIA '26",hero:"Euphoria",tag:"7TH ANNUAL ARTS & CULTURAL FESTIVAL",desc:"Sirajul Irfan Da'wa Dars flagship cultural & academic competition. Celebrating talent, literary perfection, and academic excellence.",venue:"Sirajul Irfan Off Campus",footer:"•© 2026 Sirajul Irfan Da'wa Dars •· Event Euphoria Festival Portal",posterNote:"Sirajul Irfan Da'wa Dars",logo:""};const DEF={name:"FINE ARTS 2026",hero:"FINE ARTS 2026",tag:"BLOSSOM ARTS & CULTURAL FESTIVAL",desc:"Celebrating talent, literary perfection, and academic excellence of blossom college",venue:"Blossom College",footer:"•© Students Union 2026-27",posterNote:"@blossom Students union",logo:"",ov:0};S.set={...DEF,...(S.set||{})};Object.keys(OLD).forEach(k=>{if(S.set[k]===OLD[k])S.set[k]=DEF[k]});S.pts=S.pts||[5,3,1];

let pt;
let DIRTY=false,OWNER=true,LOADED=false,PD=[];const save=()=>{if(REMOTE){DIRTY=true;bar();return}try{localStorage.setItem("euph",JSON.stringify(S))}catch(e){alert("Storage full •€“ remove some photos")}};

const UP={};
const AH=()=>{let p="";try{p=sessionStorage.getItem("apw")||""}catch(e){}return{"x-admin-password":p,"Content-Type":"application/json"}};
function norm(){S.houses=S.houses||[];S.comps=S.comps||[];S.gallery=S.gallery||[];S.parts=S.parts||[];S.tpl=S.tpl||1;S.tplOn=S.tplOn||[true,true,true];S.tplBg=S.tplBg||[null,null,null];S.set={...DEF,...(S.set||{})};Object.keys(OLD).forEach(k=>{if(S.set[k]===OLD[k])S.set[k]=DEF[k]});S.pts=S.pts||[5,3,1];delete S.pass;delete S.ph;S.news=Array.isArray(S.news)?S.news:[];S.sched=Array.isArray(S.sched)?S.sched:[]}
const imgPath=u=>{u=String(u||"");return u.startsWith("data:")?UP[u]:(u.startsWith("/api/img?id=")?u:null)};
async function dataOut(){const o=JSON.parse(JSON.stringify(S));delete o.pass;delete o.ph;o.v=1;const jobs=[],fix=(v,set)=>{if(v&&String(v).startsWith("data:"))jobs.push([v,set])};o.gallery.forEach((v,i)=>fix(v,n=>o.gallery[i]=n));o.tplBg.forEach((v,i)=>fix(v,n=>o.tplBg[i]=n));fix(o.set.logo,n=>o.set.logo=n);o.comps.forEach(cp=>fix(cp.poster,n=>cp.poster=n));let k=0;for(const[v,set]of jobs){if(UP[v]){set(UP[v]);continue}toast("Uploading image "+(++k)+"•€¦");const r=await fetch("/api/img",{method:"POST",headers:AH(),body:JSON.stringify({dataUrl:v})});if(r.status===401)throw new Error("wrong password •€” log in again");if(!r.ok)throw new Error("image upload failed ("+r.status+")");const j=await r.json();UP[v]=j.path;set(j.path)}return o}
async function pubNow(){applyAll();toast("Updating•€¦");try{const o=await dataOut();const r=await fetch("/api/data",{method:"POST",headers:AH(),body:JSON.stringify(o)});if(r.status===401){lock();return toast("Session expired •€” log in again")}if(!r.ok)throw new Error("server error "+r.status);const j=await r.json();S.upd=j.upd;DIRTY=false;bar();for(const p of PD.splice(0)){try{await fetch(p,{method:"DELETE",headers:AH()})}catch(e){}}toast("Updated •€” visible on every phone in a few seconds")}catch(e){toast("Could not update: "+((e&&e.message)||e))}}
async function loadData(first){if(!first&&(admin||DIRTY))return;try{const ac=new AbortController(),tt=setTimeout(()=>ac.abort(),10000);const r=await fetch("/api/data"+(first?"":"?since="+(S.upd||0)),{cache:"no-store",signal:ac.signal});clearTimeout(tt);if(!r.ok)throw new Error("x");const d=await r.json();if(!d.unchanged){S=Object.assign(JSON.parse(JSON.stringify(SEED)),d);norm();[0,1,2].forEach(loadBg);loadLogo();LOADED=true;render()}}catch(e){}if(!LOADED){LOADED=true;render()}}
const $=s=>document.querySelector(s),esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let admin=(()=>{try{return sessionStorage.getItem("adm")==="1"}catch(e){return false}})(),tmr;
function earnedPoints(h){let p=0;S.comps.forEach(c=>(c.res||[]).forEach(r=>{if(r.h===h.n)p+=(c.pts||S.pts)[r.pos-1]||0}));return p}
function standings(){return S.houses.map(h=>({n:h.n,p:(+h.b||0)+earnedPoints(h)})).sort((a,b)=>b.p-a.p)}
let pointsNeedConfirm=false;
document.addEventListener("input",e=>{if(e.target&&e.target.matches('#app input[data-a="hc"]'))pointsNeedConfirm=true});
function nav(r){$("#nav").innerHTML='<a href="#home" title="Home" onclick="tap5(event)" style="margin-right:auto;padding:0;background:none">'+(S.set.logo?'<img src="'+S.set.logo+'" alt="" style="height:30px;vertical-align:middle;margin-right:8px">':'')+'<b>'+esc(S.set.name)+'</b></a>'+[["home","Home"],["result","Results"],["gallery","Gallery"],["about","About"],["schedule","Schedule"]].map(([h,t])=>`<a href="#${h}" class="${r===h?"on":""}">${t}</a>`).join("")+(REMOTE&&OWNER&&admin&&r==="admin"?'<button id="ub" class="btn" style="padding:7px 16px" onclick="upd(this)">'+(DIRTY?"•— Update site":"Update site")+'</button>':'')}
function houseList(){const s=standings().filter(x=>x.p>=1);if(!s.length)return'<div class="card mu">No team points yet.</div>';const m=Math.max(1,...s.map(x=>x.p));return s.map((h,i)=>`<div class="card"><div class="house"><div class="r">${i+1}</div><div class="n">${esc(h.n)}<div class="mu" style="font-size:12px;font-weight:400">${i?"":"Current Lead"}</div></div><div class="p">${h.p} PTS</div></div><div class="bar"><i style="width:${h.p/m*100}%"></i></div></div>`).join("")}
function tick(){const e=$("#cd");if(!e)return clearInterval(tmr);let d=Math.max(0,new Date(S.date)-Date.now())/1000|0;const v=[d/86400|0,d%86400/3600|0,d%3600/60|0,d%60];e.innerHTML=["Days","Hours","Mins","Secs"].map((l,i)=>`<div><b>${String(v[i]).padStart(2,"0")}</b><span>${l}</span></div>`).join("")}
function home(){const d=new Date(S.date);return `<div class="hero">${S.set.logo?`<img src="${S.set.logo}" alt="Logo" style="height:110px;max-width:70%;object-fit:contain;display:block;margin:0 auto 14px">`:""}<small>${esc(S.set.tag)}</small><h1>${esc(S.set.hero)}</h1><p>${esc(S.set.desc)}</p>
<div class="meta"><span>📍 ${esc(S.set.venue)}</span></div><a class="btn" href="#result">VIEW RESULTS →</a></div>

${standings().some(x=>x.p>=1)?`<h2>Who's Leading? <span class="tag">LIVE</span></h2>${houseList()}<a class="btn s" href="#result">See all houses & full standings →</a>`:""}
<h2>Find a Result</h2><div class="card"><div class="row"><select id="fp"></select></div><br><button class="btn" onclick="location.hash='result?'+($('#fp').value||'')">GET RESULT →</button></div>
<h2>In Pictures</h2>${gal(8)}<p><a class="btn s" href="#gallery">Open full gallery</a></p>`}
function fill(){$("#fp").innerHTML='<option value="">All competitions</option>'+S.comps.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join("")}
function gal(n){const g=n?S.gallery.slice(0,n):S.gallery;return g.length?`<div class="grid">${g.map((s,i)=>`<div style="position:relative"><img src="${s}" alt="Festival photo" onclick="lb(${i})"><button style="position:absolute;right:8px;bottom:8px;padding:8px 14px;font-size:13px;font-weight:700;background:#c8322b;color:#fff;border:0;border-radius:50px;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.2)" ...>↓ DOWNLOAD</button></div>`).join("")}</div>`:'<div class="card mu">No photos yet. Admins can upload from the admin panel.</div>'}
function showImg(s){$("#lbi").src=s;$("#lbd").href=s;$("#lb").style.display="flex"}
function lb(i){showImg(S.gallery[i])}
async function shareImg(e){e.stopPropagation();try{await navigator.share({title:"Euphoria '26",url:location.href})}catch(x){navigator.clipboard&&navigator.clipboard.writeText(location.href);alert("Link copied")}}
function about(){return `<h2>About Fine Arts 2026</h2>
<div class="card">
<p>Welcome to Fine Arts 2026, the annual arts and cultural festival of Blossom Arts and Science College, where creativity meets passion and talent finds its stage. Fine Arts is more than just a festival; it is a vibrant celebration of imagination, artistic expression, cultural diversity, and the extraordinary talents of our students. It brings together young minds from different departments to explore their creative abilities, showcase their artistic skills, and create unforgettable memories through the power of art and culture.</p>

<p>At Blossom College, we believe that every student possesses a unique talent waiting to be discovered. Fine Arts provides a wonderful platform for students to express themselves through literature, music, dance, painting, theatre, photography, and various other artistic disciplines. From the elegance of classical performances to the excitement of contemporary art, from the beauty of poetry to the creativity of visual expressions, every performance and creation reflects the enthusiasm, dedication, and individuality of our students.</p>

<p>Fine Arts 2026 celebrates the spirit of unity, friendship, healthy competition, and cultural harmony. It encourages students to step beyond their comfort zones, embrace new challenges, and discover the limitless possibilities of their imagination. Every competition, performance, and artistic creation becomes an opportunity to learn, grow, inspire, and connect with others. The festival also nurtures teamwork, confidence, leadership, and appreciation for the rich cultural heritage that makes our community unique.</p>

<p>As the campus comes alive with colours, rhythms, emotions, and creative energy, Fine Arts 2026 promises to be a memorable journey filled with inspiration, excitement, and artistic excellence. Let us celebrate the beauty of creativity, honour the talents of our students, and make every moment a reflection of our passion and enthusiasm.</p>
<h3>Festival Resources</h3>
<p class="mu">Explore the festival brochure and programme schedule below.</p>
<div class="row" style="flex-wrap:wrap;gap:10px">
<a class="btn" href="./assets/brochure.pdf" target="_blank" rel="noopener">View Brochure →</a>
<a class="btn s" href="#schedule">View Schedule →</a>
</div>
</div>`}
function result(q){const id=+q,cs=S.comps.filter(c=>!id||c.id===id);return `<h2>Published Results</h2>${houseList()}<h2>Competition Results</h2>
<div class="card"><input id="sq" placeholder="Search candidate or competition•€¦" oninput="srch()"></div><div id="rl">${rlist(cs,"")}</div>`}
const SEL={},PV={},COL={},TPL=[{bg:["#000000","#000000"],ac:"#f7d84a",tx:"#ffffff"},{bg:["#7c5cff","#2b1a6b"],ac:"#ffd76a",tx:"#ffffff"},{bg:["#fff7e6","#ffe3b0"],ac:"#b45309",tx:"#2a1a05"}];
const BGI={};
function loadBg(i){const d=S.tplBg[i];if(d){const im=new Image();im.onload=()=>{BGI[i]=im;render()};im.src=d}else delete BGI[i]}
async function setBg(i,d){if(d&&String(d).includes("/api/img?id=")){try{d=await asData(d,1080)}catch(e){return toast("Could not use that photo, upload it directly instead")}}S.tplBg[i]=d||null;save();loadBg(i);render()}
function upBg(i,f){if(!f)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,1080/im.width),c=document.createElement("canvas");c.width=im.width*k;c.height=im.height*k;c.getContext("2d").drawImage(im,0,0,c.width,c.height);setBg(i,c.toDataURL("image/jpeg",.8))};im.src=r.result};r.readAsDataURL(f)}
function adj(i,d){S.houses[i].b=(S.houses[i].b||0)+d;save();render()}
const hsel=v=>S.houses.map(h=>`<option ${h.n===v?"selected":""}>${esc(h.n)}</option>`).join("");
function renP(i,v){v=v.trim();if(!v)return render();const o=S.parts[i].n;S.parts[i].n=v;S.comps.forEach(c=>c.res.forEach(r=>{if(r.name===o)r.name=v}));save();render()}
async function gdl(i) {
  const u = S.gallery[i];

  if (!u) {
    toast("Photo not found");
    return;
  }

  try {
    toast("Downloading photo...");

    const response = await fetch(u);

    if (!response.ok) {
      throw new Error("Download failed");
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;

    const type = blob.type;
    const ext = type.includes("png") ? "png" :
                type.includes("webp") ? "webp" :
                type.includes("jpeg") ? "jpg" : "jpg";

    a.download = "Finearts-photo-" + (i + 1) + "." + ext;

    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);

    toast("Photo downloaded successfully!");

  } catch (error) {
    console.error(error);
    toast("Download failed. Check image hosting CORS settings.");
  }
}
function impRows(rows){let nw=0,nt=0,nc=0,first=true,uid=Date.now();rows.forEach(a=>{a=a.map(x=>String(x==null?"":x).trim());const hd=first&&/^(name|participant|student)/i.test(a[0]||"");first=false;if(hd||!a[0])return;const tm=a[1]||"",cs=a.slice(2).join("|").split(/[|;,\/]/).map(x=>x.trim()).filter(Boolean);let h=S.houses.find(x=>x.n.toLowerCase()===tm.toLowerCase());if(!h&&tm){h={n:tm,b:0};S.houses.push(h);nt++}let p=S.parts.find(x=>x.n.toLowerCase()===a[0].toLowerCase());if(!p){p={n:a[0],h:h?h.n:(S.houses[0]||{}).n||"",comps:[]};S.parts.push(p);nw++}else if(h)p.h=h.n;cs.forEach(cn=>{let c=S.comps.find(x=>x.name.toLowerCase()===cn.toLowerCase());if(!c){c={id:++uid,cat:"General",type:"Individual",name:cn,res:[]};S.comps.push(c);nc++}if(!p.comps.includes(c.id))p.comps.push(c.id)})});save();render();toast(nw+" new participants, "+nt+" new teams, "+nc+" new competitions")}
function bulk(){const rows=$("#bk").value.split(/\r?\n/).filter(l=>l.trim()).map(l=>l.includes("\t")?l.split("\t"):l.split(","));if(!rows.length)return toast("Paste some rows first");impRows(rows)}
function bulkFile(f){if(!f)return;if(!window.XLSX)return toast("Spreadsheet reader not loaded (needs internet)");const r=new FileReader();r.onload=()=>{try{const wb=XLSX.read(r.result,{type:"array"});impRows(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1,defval:""}))}catch(e){toast("Could not read that file")}};r.readAsArrayBuffer(f)}
function sampleRows(){const A=S.houses[0]?S.houses[0].n:"Team A",B=S.houses[1]?S.houses[1].n:"Team B";return[["Ansif P",A,"Qiraath"],["Ansif P",A,"Speech"],["Riyas K",B,"Qiraath, Poetry"],["Shafi M",A,"Quiz"]]}
function useSample(){$("#bk").value=[["Name","Team","Competition"],...sampleRows()].map(r=>r.join("\t")).join("\n")}
let LG=null;
function loadLogo(){if(S.set.logo){const im=new Image();im.onload=()=>{LG=im;render()};im.src=S.set.logo}else LG=null}
function upLogo(f){if(!f)return;if(f.type!=="image/png")return toast("Please choose a PNG file");const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,400/im.width),c=document.createElement("canvas");c.width=im.width*k;c.height=im.height*k;c.getContext("2d").drawImage(im,0,0,c.width,c.height);S.set.logo=c.toDataURL("image/png");save();loadLogo();render()};im.src=r.result};r.readAsDataURL(f)}
const pk=c=>c.pub||c.id,pubList=()=>S.comps.filter(c=>c.res.length||c.poster).sort((a,b)=>pk(a)-pk(b));
function fx(){const rm=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;if(rm)return;const y=window.scrollY||0,h=document.querySelector(".hero h1"),b=document.querySelector("#nav a b");if(h){h.style.transform="translateY("+y*.3+"px) scale("+Math.max(.55,1-y/800)+")";h.style.opacity=Math.max(0,1-y/420)}if(b){b.style.display="inline-block";b.style.letterSpacing=(2+Math.min(y/50,6))+"px";b.style.transition="letter-spacing .2s"}}
addEventListener("scroll",fx,{passive:true});
const cmp=id=>S.comps.find(x=>x.id==id),parseM=v=>String(v).split(/[,\s]+/).filter(x=>x!=="").map(Number).filter(x=>!isNaN(x));
const AP={nws:(i,j,v)=>{if(S.news&&S.news[i]!==undefined)S.news[i]=v},sset:(i,j,v)=>{S.set[i]=v},hn:(i,j,v)=>{v=v.trim();if(v&&v!==S.houses[i].n)ren(i,v)},hb:(i,j,v)=>{S.houses[i].b=+v||0},hc:(i,j,v)=>{const h=S.houses[+i];if(h)h.b=(+v||0)-earnedPoints(h)},
pn:(i,j,v)=>{v=v.trim();const q=S.parts[i];if(!v||v===q.n)return;const o=q.n;q.n=v;S.comps.forEach(c=>c.res.forEach(r=>{if(r.name===o)r.name=v}))},ph:(i,j,v)=>{S.parts[i].h=v},
rn:(i,j,v)=>{cmp(i).res[j].name=v},rh:(i,j,v)=>{cmp(i).res[j].h=v},cn:(i,j,v)=>{if(v.trim())cmp(i).name=v.trim()},cp:(i,j,v)=>{const a=parseM(v);cmp(i).pts=a.length?a:null},
pm:(i,j,v)=>{const a=parseM(v);if(a.length)S.pts=a},tpn:(i,j,v)=>{S.set.posterNote=v},ton:(i,j,v)=>{S.tplOn[i]=v},tdf:(i,j,v)=>{S.tpl=+v},tov:(i,j,v)=>{S.set.ov=(+v)/100},sdt:(i,j,v)=>{S.sched[i].d=v.trim()},sit:(i,j,v)=>{S.sched[i].r[j].i=v},stm:(i,j,v)=>{S.sched[i].r[j].t=v},spl:(i,j,v)=>{S.sched[i].r[j].p=v}};
function applyAll(){document.querySelectorAll("#app input[data-a],#app select[data-a],#app textarea[data-a]").forEach(el=>{try{const t=el.type,v=t==="checkbox"?el.checked:t==="radio"?(el.checked?el.value:null):el.value;if(v===null)return;AP[el.dataset.a](el.dataset.i,el.dataset.j,v)}catch(e){}})}
function confirmPoints(){const rows=document.querySelectorAll('#app input[data-a="hc"]');rows.forEach(el=>{const i=+el.dataset.i;AP.hn(i,null,document.querySelector(`#app input[data-a="hn"][data-i="${i}"]`)?.value||S.houses[i]?.n||"");AP.hc(i,null,el.value)});pointsNeedConfirm=false;save();render();toast("Team points confirmed. Press Update site to publish.")}
async function upd(btn){if(pointsNeedConfirm){toast("Please confirm the edited team points before publishing.");return}applyAll();save();render();if(REMOTE)await pubNow();else toast("Updated")}
function bump(b,d){const i=b.parentElement.querySelector("input");i.value=(+i.value||0)+d}
function markCard(){return `<div class="card"><b>Mark format</b> <span class="mu">(custom marks per position, comma separated)</span><br><br><input value="${S.pts.join(",")}" data-a="pm" placeholder="e.g. 10,7,5,3,1"><div class="mu" style="font-size:12px;margin:6px 0 10px">Position 1 gets the first number, position 2 the second, and so on. Positions beyond the list get 0. A single competition can use its own marks in "Competitions & results".</div></div>`}
const setS=(k,v)=>{S.set[k]=v;save();nav("admin")};
function settCard(){const f=[["name","Festival name (menu, posters, page title)"],["hero","Home title"],["tag","Tagline"],["venue","Venue"],["footer","Footer text"]];return `<div class="card"><b>Site settings</b><br><br>${f.map(([k,l])=>`<label class="mu" style="font-size:13px">${l}</label><input value="${esc(S.set[k])}" data-a="sset" data-i="${k}" style="margin:4px 0 10px">`).join("")}<label class="mu" style="font-size:13px">Logo (PNG, shown at the top of the site)</label><div style="margin:6px 0 12px">${S.set.logo?`<img src="${S.set.logo}" alt="Logo" style="height:70px;display:block;margin-bottom:8px">`:""}<input type="file" accept="image/png" onchange="upLogo(this.files[0])">${S.set.logo?`<button class="btn d" style="padding:3px 12px;margin-top:6px" onclick="S.set.logo='';save();loadLogo();render()">Remove logo</button>`:""}</div><label class="mu" style="font-size:13px">Description</label><textarea rows="3" data-a="sset" data-i="desc" style="margin:4px 0 10px">${esc(S.set.desc)}</textarea><button class="btn s" onclick="S.set={...DEF};save();render()">Restore defaults</button></div>`}
function poster(c,t){
const bi=BGI[t-1],B=TPL[t-1],T=bi?{...B,ac:t===3?"#ffd76a":B.ac,tx:"#ffffff"}:B,
cv=document.createElement("canvas");cv.width=1080;cv.height=1350;
const x=cv.getContext("2d"),g=x.createLinearGradient(0,0,1080,1350);
g.addColorStop(0,T.bg[0]);g.addColorStop(1,T.bg[1]);x.fillStyle=g;x.fillRect(0,0,1080,1350);
if(bi){
  const k=Math.max(1080/bi.width,1350/bi.height),bw=bi.width*k,bh=bi.height*k;
  x.drawImage(bi,(1080-bw)/2,(1350-bh)/2,bw,bh);
  const ov=Math.max(0,Math.min(.8,+S.set.ov||0));
  if(ov>0){x.fillStyle="rgba(0,0,0,"+ov+")";x.fillRect(0,0,1080,1350)}
}
const F="Sora,system-ui,sans-serif",L=150,
fo=(w,z)=>{x.font=w+" "+z+"px "+F;if("letterSpacing" in x)x.letterSpacing=(-.035*z)+"px"};

const no=pubList().indexOf(c)+1||1;
x.textAlign="right";x.fillStyle=T.ac;fo(700,32);
x.fillText("Result No "+String(no).padStart(2,"0"),960,140);

x.textAlign="left";
x.fillStyle=T.ac;fo(800,68);
let ln=[],cur="";
c.name.split(" ").forEach(w=>{const tt=cur?cur+" "+w:w;if(x.measureText(tt).width>800&&cur){ln.push(cur);cur=w}else cur=tt});
ln.push(cur);ln=ln.slice(0,2);
ln.forEach((q,i)=>x.fillText(q,L,350+i*70,800));

const rs=c.res.slice().sort((a,b)=>a.pos-b.pos).slice(0,10),
y0=496+(ln.length-1)*70+(ln.length>1?20:0),
h=Math.min(108,(1130-y0)/Math.max(rs.length,1)),s=Math.min(1,h/108);
rs.forEach((r,i)=>{
  const ry=y0+i*h;
  x.fillStyle=T.tx;fo(400,36*s);
  x.fillText(["1ST","2ND","3RD"][r.pos-1]||r.pos+"TH",L,ry+12*s);
  fo(700,38*s);x.fillText(r.name,254,ry,780);
  fo(400,28*s);x.fillText(r.h,254,ry+31*s,780);
});

x.fillStyle=T.ac;fo(700,22);x.fillText(S.set.posterNote,L,1202);
return cv}
function toast(m){let e=$("#ts");if(!e){e=document.createElement("div");e.id="ts";e.style.cssText="position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:var(--ac);color:#000;padding:10px 18px;border-radius:20px;font-weight:700;z-index:30;max-width:90%;text-align:center";document.body.appendChild(e)}e.textContent=m;e.style.bottom="28px";e.style.display="block";clearTimeout(e.t);e.t=setTimeout(()=>e.style.display="none",3000)}
window.alert=toast;
// ===== Breaking News (scrolling bar + admin box) =====
function bnRender(){const el=$("#bn");if(!el)return;const m=(S.news||[]).map(x=>String(x||"").trim()).filter(Boolean);if(!m.length){el.className="";el.innerHTML="";return}const d=Math.max(20,Math.round(m.join(" ").length*.2+12));el.className="on";el.innerHTML='<div class="lb"><i></i>BREAKING NEWS</div><div class="vp"><div class="tk" style="--d:'+d+'s">'+m.map(esc).join('<span style="margin:0 28px;opacity:.7">•—</span>')+'</div></div>'}
function newsCard(){const n=S.news||[];return `<div class="card"><b>Breaking News</b> <span class="mu" style="font-size:13px">(scrolls from right to left under the menu on every page)</span><div class="row" style="margin:10px 0"><input id="nw" placeholder="Message•€¦" maxlength="200" onkeydown="if(event.key==='Enter')addN()"><button class="btn" onclick="addN()">Add</button></div>${n.length?n.map((t,i)=>`<div class="house" style="margin-bottom:6px"><input value="${esc(t)}" data-a="nws" data-i="${i}" maxlength="200" style="flex:1"><button class="btn d" onclick="delN(${i})">×</button></div>`).join(""):'<div class="mu" style="font-size:13px">No messages yet •€” the news bar stays hidden.</div>'}</div>`}
function addN(){const v=$("#nw").value.trim();if(!v)return toast("Type a message first");(S.news=S.news||[]).push(v);save();render()}
function delN(i){S.news.splice(i,1);save();render()}
// ===== end Breaking News =====
function bar(){const b=$("#ub");if(b)b.textContent=DIRTY?"•— Update site":"Update site"}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("button");if(b&&admin&&b.closest("#app"))applyAll()},true);
["input","change"].forEach(ev=>document.addEventListener(ev,e=>{if(admin&&REMOTE&&e.target.dataset&&e.target.dataset.a&&e.target.tagName!=="BUTTON"){DIRTY=true;bar()}}));
addEventListener("beforeunload",e=>{if(REMOTE&&OWNER&&DIRTY){e.preventDefault();e.returnValue=""}});
function cf(el,fn){if(el.dataset.a){fn();return}el.dataset.a=1;el.dataset.t=el.textContent;el.textContent="Tap again to confirm";setTimeout(()=>{if(el.isConnected){delete el.dataset.a;el.textContent=el.dataset.t}},3000)}
function fresh(){S=JSON.parse(JSON.stringify(SEED));S.parts=[];S.tpl=1;S.tplOn=[true,true,true];S.tplBg=[null,null,null];S.set={...DEF};S.sched=[]}
const curT=c=>{const on=[1,2,3].filter(i=>S.tplOn[i-1]);return on.includes(SEL[c.id])?SEL[c.id]:(on.includes(S.tpl)?S.tpl:on[0]||1)};
function tp(id,t){SEL[id]=t;PV[id]=1;srch()}
function tg(id){COL[id]=!COL[id];srch()}
function pcv(id){const c=S.comps.find(x=>x.id===id);return[c,poster(c,curT(c))]}
function dl(id){const[c,cv]=pcv(id),u=cv.toDataURL("image/png"),a=document.createElement("a");a.href=u;a.download=c.name+"-result.png";try{a.click()}catch(e){}showImg(u);toast("Press and hold (or right-click) the poster to save")}
function sh(id){const[c,cv]=pcv(id);cv.toBlob(async b=>{const f=new File([b],c.name+".png",{type:"image/png"});try{if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f],title:c.name+" Result"});else if(navigator.share)await navigator.share({title:c.name+" Result",url:location.href});else{navigator.clipboard.writeText(location.href);alert("Link copied")}}catch(e){}})}
function rlist(cs,q){q=q.toLowerCase();const o=cs.filter(c=>(c.res.length||c.poster)&&(!q||c.name.toLowerCase().includes(q)||c.res.some(r=>r.name.toLowerCase().includes(q))));return o.sort((a,b)=>pk(a)-pk(b)).map(c=>{const n=pubList().indexOf(c)+1,t=curT(c),rs=c.res.slice().sort((a,b)=>a.pos-b.pos),on=[1,2,3].filter(i=>S.tplOn[i-1]);
return `<div class="rc"><div class="rh" onclick="tg(${c.id})"><div class="no">#${String(n).padStart(2,"0")}</div><div><span class="mu" style="font-size:12px">→ ${c.type||"Individual"}</span><div style="font-size:20px;font-weight:800">${esc(c.name)}</div></div><span class="pb">•— Published</span><span class="mu">${COL[c.id]?"•–¾":"•–´"}</span></div>${COL[c.id]?"":`<div class="tbl" style="padding:8px 20px"><table class="rt"><tr><th>RANK</th><th>PARTICIPANT</th><th>TEAM</th><th>MARK</th></tr>${rs.map(r=>`<tr><td><span class="rk" style="background:${["#fbbf24","#cbd5e1","#c2701d"][r.pos-1]||"var(--bd)"};${r.pos>3?"color:var(--tx)":""}">${r.pos}</span></td><td><b>${esc(r.name.toUpperCase())}</b></td><td>${esc(r.h)}</td><td>${(c.pts||S.pts)[r.pos-1]||0}</td></tr>`).join("")}</table>${c.poster?`<img src="${c.poster}" alt="Result poster" style="width:100%;border-radius:10px;margin-top:10px;cursor:pointer" onclick="showImg(this.src)">`:""}${PV[c.id]?`<img src="${poster(c,t).toDataURL("image/jpeg",.8)}" alt="Poster preview" style="width:100%;max-width:420px;display:block;margin:12px auto;border-radius:10px">`:""}</div><div class="rf"><span class="mu" style="font-size:13px">•” Official Verified Result</span><div class="tabs">${on.map(i=>`<button class="${i===t?"on":""}" onclick="tp(${c.id},${i})">Poster ${i}</button>`).join("")}</div><button class="btn s" style="color:var(--ac);border-color:var(--ac)" onclick="dl(${c.id})">↓ DOWNLOAD</button><button class="btn s" onclick="sh(${c.id})">SHARE</button></div>`}</div>`}).join("")||'<div class="card mu">No published results found.</div>'}
function tplCard(){const A=S.houses[0]?S.houses[0].n:"Team A",B=S.houses[1]?S.houses[1].n:"Team B",sm={name:"Sample Event",cat:"Prime Zone",type:"Individual",res:[{pos:1,name:"Participant One",h:A,g:"A+"},{pos:2,name:"Participant Two",h:B,g:"A"},{pos:3,name:"Participant Three",h:A,g:"B"}]};return `<div class="card"><b>Poster templates</b> <span class="mu">(visitors see these as Poster 1•€“3 on Results)</span><div style="margin:12px 0"><label class="mu" style="font-size:13px">Poster bottom small text (bottom-left of every poster)</label><input value="${esc(S.set.posterNote)}" data-a="tpn" style="margin:4px 0 8px"><button class="btn s" style="padding:4px 12px" onclick="this.previousElementSibling.value=DEF.posterNote">Use: ${esc(DEF.posterNote)}</button></div><div style="margin:12px 0"><label class="mu" style="font-size:13px">Background darkness on custom photos (0 = none)</label><input type="range" min="0" max="80" value="${Math.round((S.set.ov||0)*100)}" data-a="tov" style="margin:6px 0"></div><div class="grid" style="margin-top:12px">${[1,2,3].map(i=>`<div><img src="${poster(sm,i).toDataURL("image/jpeg",.5)}" style="cursor:default;aspect-ratio:4/5"><label style="display:block;margin-top:6px"><input type="checkbox" style="width:auto" ${S.tplOn[i-1]?"checked":""} data-a="ton" data-i="${i-1}"> Poster ${i} enabled</label><label style="display:block"><input type="radio" name="dt" style="width:auto" ${S.tpl===i?"checked":""} data-a="tdf" value="${i}"> Default</label><div class="mu" style="font-size:12px;margin:8px 0 4px">Custom background ${S.tplBg[i-1]?"(active)":"(none)"}</div>${S.gallery.length?`<div style="display:flex;gap:4px;overflow-x:auto;padding-bottom:4px">${S.gallery.map((g,k)=>`<img src="${g}" style="width:48px;height:48px;aspect-ratio:1;border-radius:6px;cursor:pointer;flex:none" title="Use gallery photo ${k+1}" onclick="setBg(${i-1},S.gallery[${k}])">`).join("")}</div>`:`<div class="mu" style="font-size:12px">Add gallery photos below, or upload here.</div>`}<input type="file" accept="image/*" onchange="upBg(${i-1},this.files[0])" style="margin-top:6px">${S.tplBg[i-1]?`<button class="btn d" style="padding:3px 12px;margin-top:6px" onclick="setBg(${i-1},null)">Reset to default</button>`:""}</div>`).join("")}</div></div>`}
function srch(){const id=+(location.hash.split("?")[1]||0);$("#rl").innerHTML=rlist(S.comps.filter(c=>!id||c.id===id),$("#sq").value)}
const lsg=k=>{try{return localStorage.getItem(k)}catch(e){return null}},ssg=k=>{try{return sessionStorage.getItem(k)}catch(e){return null}},DEFH="240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";
async function sha(t){try{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}catch(e){return null}}
function login(){if(REMOTE&&OWNER===null)return`<h2>Admin</h2><div class="card mu">Checking access•€¦</div>`;if(REMOTE&&!OWNER)return`<h2>Admin</h2><div class="card mu">The admin panel is private. Only the site owner can open it.</div>`;return `<h2>Admin Login</h2><div class="card"><input id="pw" type="password" placeholder="Admin password" onkeydown="if(event.key==='Enter')doLogin()"><br><br><button class="btn" onclick="doLogin()">Login</button></div>`}
async function doLogin(){const v=$("#pw").value;try{const r=await fetch("/api/data?login=1",{method:"POST",headers:{"x-admin-password":v}});if(r.ok){admin=true;try{sessionStorage.setItem("adm","1");sessionStorage.setItem("apw",v)}catch(e){}render()}else if(r.status===401)toast("Wrong password");else toast("Server not ready •€” check the database setup")}catch(e){toast("Cannot reach the server")}}
function lock(){admin=false;try{sessionStorage.removeItem("adm");sessionStorage.removeItem("apw")}catch(e){}render()}

let TP=[];function tap5(e){const n=Date.now();TP=TP.filter(t=>n-t<3000);TP.push(n);if(TP.length>=5){TP=[];e.preventDefault();location.hash="admin"}}
function adminPanel(){const s=S;return `<h2>Admin Panel <button class="btn s" onclick="lock()">Lock</button></h2><div class="card mu" style="font-size:13px">Every add, remove or edit is staged here first. Press <b>Update site</b> in the top bar to publish everything. Visitors' phones refresh by themselves within a few seconds.</div>${newsCard()}
<div class="card"><b>Teams</b> <span class="mu">(manually edit the current total points for each team)</span><div class="tbl"><table><tr><th>TEAM</th><th>CURRENT POINTS</th><th></th></tr>${s.houses.map((h,i)=>`<tr><td><input value="${esc(h.n)}" data-a="hn" data-i="${i}"></td><td><input type="number" min="0" step="1" style="width:110px" value="${standings().find(x=>x.n===h.n)?.p||0}" data-a="hc" data-i="${i}" aria-label="Current points for ${esc(h.n)}"></td><td><button class="btn d" onclick="S.houses.splice(${i},1);save();render()">×</button></td></tr>`).join("")}</table></div><div style="margin-top:12px;display:flex;gap:10px;align-items:center;flex-wrap:wrap"><button class="btn" onclick="confirmPoints()">•“ Confirm Team Points</button><span class="mu" style="font-size:12px">Confirm the edited totals before publishing.</span></div><br><br>
<div class="row"><input id="hn" placeholder="New team name"><button class="btn" onclick="if($('#hn').value){S.houses.push({n:$('#hn').value,b:0});save();render()}">Add team</button></div></div>
<div class="card"><b>Add competition</b><br><br><div class="row"><select id="ct"><option>Individual</option><option>Group</option></select><input id="cn" placeholder="Competition name"><button class="btn" onclick="addC()">Add</button></div></div>
${importCard()}${markCard()}${settCard()}${tplCard()}${partCard()}${pubCard()}${schedCard()}
<div class="card"><b>Competitions & results</b>${s.comps.map(c=>`<div style="margin-top:12px"><input style="width:200px;font-weight:700" value="${esc(c.name)}" data-a="cn" data-i="${c.id}"> <input style="width:130px" value="${(c.pts||[]).join(",")}" placeholder="Marks (default)" title="Custom marks for this competition, e.g. 10,7,5. Blank = default" data-a="cp" data-i="${c.id}"> <button class="btn d" style="padding:2px 10px" onclick="cf(this,()=>{S.comps=S.comps.filter(x=>x.id!==${c.id});save();render()})">Delete</button>${c.poster?` <button class="btn s" style="padding:2px 10px" onclick="delete S.comps.find(x=>x.id===${c.id}).poster;save();render()">remove poster</button>`:""}${c.res.map((r,i)=>`<div style="margin-top:6px">${r.pos}. <input style="width:180px" value="${esc(r.name)}" data-a="rn" data-i="${c.id}" data-j="${i}"> •· <select style="width:auto" data-a="rh" data-i="${c.id}" data-j="${i}">${hsel(r.h)}</select> <button class="btn d" style="padding:2px 10px" onclick="S.comps.find(x=>x.id===${c.id}).res.splice(${i},1);save();render()">remove</button></div>`).join("")}</div>`).join("")}</div>
<div class="card"><b>Gallery upload</b><br><br><input type="file" accept="image/*" multiple onchange="up(this.files)">${s.gallery.length?`<div class="grid" style="margin-top:12px">${s.gallery.map((g,i)=>`<div><img src="${g}"><button class="btn d" style="width:100%;margin-top:4px" onclick="delG(${i})">Delete</button></div>`).join("")}</div>`:""}</div>

<div class="card"><button class="btn d" onclick="cf(this,()=>{fresh();save();[0,1,2].forEach(loadBg);loadLogo();render()})">Reset all data</button></div>`}
function ren(i,v){const o=S.houses[i].n;S.houses[i].n=v;S.comps.forEach(c=>c.res.forEach(r=>{if(r.h===o)r.h=v}));S.parts.forEach(p=>{if(p.h===o)p.h=v});save()}
function addC(){if(!$("#cn").value)return;S.comps.push({id:Date.now(),type:$("#ct").value,name:$("#cn").value,res:[]});save();render()}
let upP=null;
const hopts=()=>S.houses.map(h=>`<option>${esc(h.n)}</option>`).join("");
function plopts(){const id=$("#rc")?$("#rc").value:(S.comps[0]||{}).id;let l=S.parts.filter(p=>p.comps.includes(+id));if(!l.length)l=S.parts;return l.map(p=>`<option value="${esc(p.n)}">${esc(p.h)}</option>`).join("")}
const rowHtml=n=>`<div class="row pr" style="margin-bottom:8px"><input type="number" class="pp" value="${n}" style="flex:0 0 70px;min-width:70px" title="Position"><input class="pn" list="pl" placeholder="Participant name (type or pick)" onchange="pick(this)"><select class="ph">${hopts()}</select></div>`;
function pubCard(){return `<div class="card"><b>Publish results</b> <span class="mu">(marks follow the Mark format; add as many positions as needed)</span><br><br><select id="rc" onchange="$('#pl').innerHTML=plopts()">${S.comps.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select><datalist id="pl">${plopts()}</datalist><br><br><div id="rws">${[1,2,3].map(rowHtml).join("")}</div><button class="btn s" onclick="addRow()">+ Add position</button><br><br><b>Result poster</b> <span class="mu">(optional)</span><br><br><input type="file" accept="image/*" onchange="pp(this.files[0])"><br><br><button class="btn" onclick="addR()">Publish</button></div>`}
function addRow(){const r=$("#rws");r.insertAdjacentHTML("beforeend",rowHtml(r.children.length+1))}
function pick(el){const p=S.parts.find(x=>x.n.toLowerCase()===el.value.trim().toLowerCase());if(p)el.nextElementSibling.value=p.h}
function pp(f){if(!f)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,1000/im.width),c=document.createElement("canvas");c.width=im.width*k;c.height=im.height*k;c.getContext("2d").drawImage(im,0,0,c.width,c.height);upP=c.toDataURL("image/jpeg",.75)};im.src=r.result};r.readAsDataURL(f)}
function addR(){const c=S.comps.find(x=>x.id==$("#rc").value);if(!c)return;let n=0;document.querySelectorAll(".pr").forEach(r=>{const nm=r.querySelector(".pn").value.trim();if(!nm)return;c.res.push({pos:+r.querySelector(".pp").value||1,name:nm,h:r.querySelector(".ph").value});n++});if(upP){c.poster=upP;upP=null;n++}if(!n)return alert("Nothing to publish");if(!c.pub)c.pub=Date.now();save();render()}
function partCard(){return `<div class="card"><b>Participants</b> <span class="mu">(${S.parts.length})</span><br><br><div class="row"><input id="pn" placeholder="Participant name"><select id="pt">${hopts()}</select></div><div style="margin:10px 0">${S.comps.map(c=>`<label style="margin-right:12px;display:inline-block"><input type="checkbox" class="pc" value="${c.id}" style="width:auto"> ${esc(c.name)}</label>`).join("")}</div><button class="btn" onclick="addP()">Add participant</button><br><br><b>Bulk add from Excel</b><div class="mu" style="font-size:13px;margin:4px 0 8px">Columns: Name | Team | Competition. Paste rows straight from Excel, or upload an .xlsx / .csv file. The same person can appear on several rows, or list several competitions in one cell separated by commas. Missing teams and competitions are created automatically.</div><div style="font-size:12px;font-weight:700;margin-bottom:4px">Excel sheet reference (first sheet, first row can be a header)</div><div class="tbl" style="margin-bottom:8px"><table style="border:1px solid var(--bd)"><tr class="mu"><th></th><th>A</th><th>B</th><th>C</th></tr><tr><td class="mu">1</td><th>Name</th><th>Team</th><th>Competition</th></tr>${sampleRows().map((r,i)=>`<tr><td class="mu">${i+2}</td>${r.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</table></div><div class="mu" style="font-size:12px;margin-bottom:8px">Rows 2•€“3: same person on two rows = two competitions. Row 4: several competitions in one cell. Column A = participant, B = team, C = competition(s).</div><button class="btn s" onclick="useSample()">Copy sample into the box</button><br><br><textarea id="bk" rows="5" placeholder="Ansif P	Team Zahora	Qiraath
Ansif P	Team Zahora	Speech"></textarea><br><br><button class="btn s" onclick="bulk()">Import pasted rows</button> <input type="file" accept=".xlsx,.xls,.csv" onchange="bulkFile(this.files[0])" style="margin-top:8px">${S.parts.length?`<div class="tbl"><table>${S.parts.map((p,i)=>`<tr><td><input value="${esc(p.n)}" data-a="pn" data-i="${i}"></td><td><select style="width:auto" data-a="ph" data-i="${i}">${hsel(p.h)}</select></td><td>${p.comps.map(id=>esc((S.comps.find(c=>c.id===id)||{name:"?"}).name)).join(", ")}</td><td><button class="btn d" style="padding:2px 10px" onclick="S.parts.splice(${i},1);save();render()">×</button></td></tr>`).join("")}</table></div>`:""}</div>`}
function addP(){const n=$("#pn").value.trim();if(!n)return;S.parts.push({n,h:$("#pt").value,comps:[...document.querySelectorAll(".pc:checked")].map(x=>+x.value)});save();render()}
function bulkOld(){let k=0,bad=0;$("#bk").value.split("\n").forEach(l=>{const a=l.split(",").map(x=>x.trim());if(!a[0])return;const h=S.houses.find(x=>x.n.toLowerCase()===(a[1]||"").toLowerCase());if(!h){bad++;return}const cs=(a[2]||"").split("|").map(x=>S.comps.find(c=>c.name.toLowerCase()===x.trim().toLowerCase())).filter(Boolean).map(c=>c.id);S.parts.push({n:a[0],h:h.n,comps:cs});k++});save();render();if(bad)alert(bad+" line(s) skipped: unknown team")}
function shrinkB(f,w,q){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,w/im.width),c=document.createElement("canvas");c.width=im.width*k;c.height=im.height*k;c.getContext("2d").drawImage(im,0,0,c.width,c.height);c.toBlob(b=>b?res(b):rej(new Error("encode")),"image/jpeg",q)};im.onerror=()=>rej(new Error("image"));im.src=r.result};r.readAsDataURL(f)})}
const b2d=b=>new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.readAsDataURL(b)});
async function up(files){const fl=[...files];if(!fl.length)return;toast("Adding photos•€¦");try{for(const f of fl){const b=await shrinkB(f,1400,.82);S.gallery.push(await b2d(b))}save();render()}catch(e){toast("Upload failed: "+((e&&e.message)||e))}}
function delG(i){const u=S.gallery[i];S.gallery.splice(i,1);{const pth=imgPath(u);if(pth)PD.push(pth)}save();render()}
async function asData(u,w){const r=await fetch(u),b=await r.blob(),d=await b2d(b);return await new Promise((res,rej)=>{const im=new Image();im.onload=()=>{const k=Math.min(1,w/im.width),c=document.createElement("canvas");c.width=im.width*k;c.height=im.height*k;c.getContext("2d").drawImage(im,0,0,c.width,c.height);res(c.toDataURL("image/jpeg",.75))};im.onerror=rej;im.src=d})}
function importCard(){let o=null;try{o=JSON.parse(localStorage.getItem("euph")||"null")}catch(e){}if(!REMOTE||!o)return"";return `<div class="card"><b>Import data saved in this browser</b><div class="mu" style="font-size:13px;margin:6px 0 10px">Your earlier work (teams, participants, results, settings) was saved only in this browser. Import it once to make it visible to everyone. Gallery photos are not imported, so upload them again.</div><button class="btn" onclick="impLocal()">Import now</button></div>`}
function impLocal(){let o;try{o=JSON.parse(localStorage.getItem("euph"))}catch(e){return}if(!o)return;o.gallery=[];delete o.pass;(o.houses||[]).forEach(h=>{if((h.n==="Team Zahora"&&h.b===635)||(h.n==="Team Fanora"&&h.b===571))h.b=0});S=Object.assign(S,o);S.v=1;try{localStorage.removeItem("euph")}catch(e){}save();render();toast("Imported")}
// ===== Schedule page (public) + admin card (Excel upload, dates) =====
function schedule(){const d=S.sched||[];return `<h2>Festival Schedule</h2><p><a class="btn s" href="#about">← Back to About</a></p>`+(d.length?d.map(x=>`<div class="card"><span class="mu" style="font-size:12px;letter-spacing:1px">DATE</span><div style="font-size:22px;font-weight:800;color:var(--ac);margin-bottom:8px">${esc(x.d)}</div><div class="tbl"><table class="st"><tr><th>ITEM</th><th>TIME</th><th>PLACE</th></tr>${x.r.map(r=>`<tr><td><b>${esc(r.i)}</b></td><td style="white-space:nowrap">${esc(r.t)}</td><td>${esc(r.p)}</td></tr>`).join("")}</table></div></div>`).join(""):`<div class="card mu">The schedule has not been published yet.</div>`)}
function schedCard(){const d=S.sched||[];return `<div class="card"><b>Schedule</b> <span class="mu" style="font-size:13px">(shown when visitors tap •€œView Schedule•€)</span><br><br>
<label class="mu" style="font-size:13px">Upload Excel / CSV with columns: Date, Item, Time, Place. Leave Date blank in the next rows of the same day. Uploading replaces the current schedule.</label>
<div class="row" style="margin:8px 0 4px"><input id="sdd" placeholder="Date heading to use if the file has no Date column (e.g. 10 Oct 2026)"></div>
<input type="file" accept=".xlsx,.xls,.csv" onchange="schedFile(this.files[0]);this.value=''" style="margin:6px 0 14px">
<div class="row" style="margin:10px 0"><input id="snd" placeholder="Add a date heading (e.g. Day 1 •€“ 10 Oct 2026)"><button class="btn" onclick="addDay()">Add date</button></div>
${d.map((x,i)=>`<div class="card" style="background:var(--bg)"><div class="row"><input value="${esc(x.d)}" data-a="sdt" data-i="${i}" style="font-weight:700" title="Date heading"><button class="btn d" style="flex:0 0 auto;min-width:0" onclick="cf(this,()=>{S.sched.splice(${i},1);save();render()})">Delete date</button></div>${x.r.map((r,j)=>`<div class="row" style="margin-top:8px"><input value="${esc(r.i)}" placeholder="Item" data-a="sit" data-i="${i}" data-j="${j}"><input value="${esc(r.t)}" placeholder="Time" data-a="stm" data-i="${i}" data-j="${j}"><input value="${esc(r.p)}" placeholder="Place" data-a="spl" data-i="${i}" data-j="${j}"><button class="btn d" style="flex:0 0 auto;min-width:0" onclick="S.sched[${i}].r.splice(${j},1);save();render()">×</button></div>`).join("")}<button class="btn s" style="margin-top:10px" onclick="addSR(${i})">+ Add row</button></div>`).join("")}
${d.length?`<button class="btn d" onclick="cf(this,()=>{S.sched=[];save();render()})">Clear whole schedule</button>`:`<div class="mu" style="font-size:13px">No schedule yet •€” visitors will see •€œnot published yet•€.</div>`}</div>`}
function addDay(){const v=$("#snd").value.trim();if(!v)return toast("Type a date heading first");(S.sched=S.sched||[]).push({d:v,r:[]});save();render()}
function addSR(i){S.sched[i].r.push({i:"",t:"",p:""});save();render()}
function schedRows(rows,defD){rows=rows.map(a=>a.map(x=>String(x==null?"":x).trim())).filter(a=>a.some(Boolean));if(!rows.length)return 0;const h=rows[0].map(x=>x.toLowerCase());let c=null;if(h.some(x=>/^(date|day|item|event|program|time|place|venue|location)/.test(x))){const f=re=>h.findIndex(x=>re.test(x));c={d:f(/^(date|day)/),i:f(/^(item|event|program|name)/),t:f(/^time/),p:f(/^(place|venue|location)/)};rows.shift()}const n=Math.max(0,...rows.map(a=>a.length));if(!c||c.i<0||c.t<0||c.p<0)c=n>=4?{d:0,i:1,t:2,p:3}:{d:-1,i:0,t:1,p:2};const out=[];let cur=defD||"";rows.forEach(a=>{const dv=c.d>=0?(a[c.d]||""):"",it=a[c.i]||"",tm=a[c.t]||"",pl=a[c.p]||"";if(dv)cur=dv;if(!it&&!tm&&!pl)return;const key=cur||"Schedule";let day=out.find(x=>x.d.toLowerCase()===key.toLowerCase());if(!day){day={d:key,r:[]};out.push(day)}day.r.push({i:it,t:tm,p:pl})});S.sched=out;save();render();return out.reduce((s,x)=>s+x.r.length,0)}
function schedFile(f){if(!f)return;if(!window.XLSX)return toast("Spreadsheet reader not loaded (needs internet)");const dd=($("#sdd")?$("#sdd").value:"").trim(),r=new FileReader();r.onload=()=>{try{const wb=XLSX.read(r.result,{type:"array"});const n=schedRows(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1,defval:"",raw:false}),dd);toast(n?n+" schedule rows added •€” press Update site to publish":"No rows found in that file")}catch(e){toast("Could not read that file")}};r.readAsArrayBuffer(f)}
// ===== end Schedule =====
function render(){const [r,q]=(location.hash.slice(1)||"home").split("?");nav(r);bnRender();document.title=S.set.name+" | Annual Arts & Cultural Fest";$("#ft").textContent=S.set.footer+(S.upd?" •· Updated "+new Date(S.upd).toLocaleString():"");clearInterval(tmr);
$("#app").innerHTML=!LOADED&&r!=="admin"?'<div class="card mu">Loading•¦</div>':r==="result"?result(q):r==="gallery"?`<h2>Festival Gallery</h2>${gal()}`:r==="about"?about():r==="schedule"?schedule():r==="admin"?(admin?adminPanel():login()):home();
if(LOADED&&(r==="home"||!r)){fill();tick();tmr=setInterval(tick,1000)}if(window.LK!==location.hash){window.scrollTo(0,0);window.LK=location.hash}fx();bar()}
addEventListener("hashchange",render);[0,1,2].forEach(loadBg);loadLogo();const rs=()=>{try{const sc=sessionStorage.getItem("sc");if(sc){sessionStorage.removeItem("sc");window.scrollTo(0,+sc)}}catch(e){}};if(REMOTE){try{const hs=sessionStorage.getItem("hs");if(hs&&!location.hash)location.hash=hs;sessionStorage.removeItem("hs")}catch(e){}}render();loadData(true);setInterval(()=>loadData(false),8000);document.addEventListener("visibilitychange",()=>{if(!document.hidden)loadData(false)});setTimeout(rs,300);if(document.fonts)Promise.all(["400","600","700","800"].map(w=>document.fonts.load(w+" 20px Sora"))).then(render).catch(()=>{});
