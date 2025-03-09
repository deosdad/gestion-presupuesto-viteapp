(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const t of r.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&n(t)}).observe(document,{childList:!0,subtree:!0});function e(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(a){if(a.ep)return;a.ep=!0;const r=e(a);fetch(a.href,r)}})();const I=`\r
    \r
\r
    <div class="layout">\r
        <div id="layout1"class="layout__section gasto-container">\r
            \r
        </div>\r
\r
        <div id="layout2" class="layout__section layout__section--secondary lista-container">\r
            \r
        </div>\r
        \r
    </div>\r
    <div class="insertar-alerta">\r
\r
    </div>\r
    \r
\r
`;class j{constructor(o,e){this.presupuesto=Number(o),this.restante=Number(e)}toJSON(){return{presupuesto:this.presupuesto,restante:this.restante}}}class P{constructor(o,e,n){this.nombre=o,this.cantidad=Number(e),this.fecha=n,this.id=P.generarID()}static generarID(){return Date.now().toString(36)+Math.random().toString(36).substring(2)}toJSON(){return{id:this.id,nombre:this.nombre,cantidad:this.cantidad,fecha:this.fecha}}}const G="Presupuesto-App",z=1,p={db:null},k=async()=>new Promise((s,o)=>{const e=indexedDB.open(G,z);e.onupgradeneeded=n=>{const a=n.target.result,r=a.createObjectStore("gastos",{keyPath:"id",autoIncrement:!1});r.createIndex("nombre","nombre",{unique:!1}),r.createIndex("cantidad","cantidad",{unique:!1}),r.createIndex("fecha","fecha",{unique:!1});const t=a.createObjectStore("presupuesto",{keyPath:"id",autoIncrement:!0});t.createIndex("presupuesto","presupuesto",{unique:!0}),t.createIndex("restante","restante",{unique:!1})},e.onsuccess=n=>{p.db=n.target.result,s(p.db)},e.onerror=()=>{o("Error al abrir la base de datos")}}),A=async()=>{if(p.db||await k(),!p.db)return!1;const e=p.db.transaction("presupuesto","readonly").objectStore("presupuesto").get(1);return new Promise((n,a)=>{e.onsuccess=r=>{n(r.target.result||!1)},e.onerror=r=>{a("No se pudo obtener el presupuesto")}})},H=async s=>{if(p.db||await k(),!p.db)return!1;const n=p.db.transaction("gastos","readonly").objectStore("gastos").get(s);return new Promise((a,r)=>{n.onsuccess=t=>{a(t.target.result||!1)},n.onerror=()=>{r("No se pudo obtener el presupuesto")}})},R=async s=>new Promise((o,e)=>{if(!p.db){e("La base de datos no está abierta.");return}const n=p.db.transaction("presupuesto","readwrite"),a=n.objectStore("presupuesto");let r;try{if(r=typeof s.toJSON=="function"?s.toJSON():s,isNaN(r.presupuesto)||isNaN(r.restante))throw new Error("El presupuesto y restante deben ser números válidos.")}catch{e("Error en la validación de presupuesto");return}const t=a.get(1);t.onsuccess=()=>{const i=t.result;if(i){i.restante=r.restante;const d=a.put(i);d.onsuccess=()=>o(d),d.onerror=()=>e(d)}else{r.id=1;const d=a.add(r);d.onsuccess=()=>o(d),d.onerror=()=>e(d)}},t.onerror=()=>e("No se pudo obtener el presupuesto"),n.onerror=()=>e("Error en la transacción")}),V=async s=>new Promise((o,e)=>{const r=p.db.transaction("gastos","readwrite").objectStore("gastos").add(s);r.onsuccess=()=>{o("Gasto agregado correctamente")},r.onerror=t=>{console.error("Error al agregar gasto",t),e("No se pudo agregar el gasto")}}),F=async()=>new Promise((s,o)=>{const a=p.db.transaction("gastos","readonly").objectStore("gastos").getAll();a.onsuccess=r=>{s(r.target.result)},a.onerror=r=>{console.error("Error al obtener los gastos",r),o("No se pudieron obtener los gastos")}}),$=s=>new Promise((o,e)=>{const r=p.db.transaction("gastos","readwrite").objectStore("gastos").delete(s);r.onsuccess=()=>{o("Gasto eliminado correctamente")},r.onerror=t=>{console.error("Error al eliminar gasto",t),e("No se pudo eliminar el gasto")}}),W=async(s,o)=>new Promise((e,n)=>{const r=p.db.transaction("gastos","readwrite").objectStore("gastos"),t=r.get(s);t.onsuccess=i=>{const d=i.target.result;if(d){const l={...d,...o},c=r.put(l);c.onsuccess=()=>e("Gasto actualizado correctamente"),c.onerror=u=>n("No se pudo actualizar el gasto")}else n("Gasto no encontrado")},t.onerror=i=>{console.error("Error al obtener el gasto para actualizar",i),n("Error al obtener el gasto para actualizar")}}),U=()=>new Promise((s,o)=>{const e=indexedDB.deleteDatabase(G);e.onsuccess=()=>{s("Base de datos eliminada correctamente")},e.onerror=n=>{o("No se pudo eliminar la base de datos")},e.onblocked=()=>{window.location.reload()}}),f={openDB:k,obtenerPresupuestoDB:A,guardarPresupuestoDB:R,guardarGastoDB:V,obtenerTodosLosGastosDB:F,eliminarGastoDB:$,actualizarGastoDB:W,obtenerGastoIDDB:H,eliminarBaseDeDatos:U},J=`<div class="presupuesto__total sombras">\r
    <p>Presupuesto: <span id="total">500</span>€</p>\r
</div>\r
<div class="presupuesto__restante sombras">\r
    <p>Restante: <span class="green" id="restante">500</span>€</p>\r
</div>`,C={presupuestoTotal:"#total",presupuestoRestante:"#restante"};let w;const X=async s=>{w=document.createElement("DIV"),w.className="presupuesto",w.innerHTML=J,s.append(w)},T=async()=>{const{presupuesto:s}=await f.obtenerPresupuestoDB();w.querySelector(C.presupuestoTotal).textContent=s;const o=await f.obtenerTodosLosGastosDB();let e=s-o.reduce((r,t)=>r+t.cantidad,0);w.querySelector(C.presupuestoRestante).textContent=e;const n=w.querySelector(C.presupuestoRestante);n.classList.remove("green","orange","red"),e<=s/4?n.classList.add("red"):e<=s/2?n.classList.add("orange"):n.classList.add("green");const a=new j(s,e);await f.guardarPresupuestoDB(a)},K=`<h2 class="lista__title">Gastos</h2>\r
<div class="lista__items" id="gastos">\r
\r
\r
\r
</div>`;let L;const Q={listaGasto:"#gastos"},Y=(s,o)=>{L=document.createElement("DIV"),L.className="lista sombras-fixed",L.innerHTML=K,s.append(L)},M=async s=>{const o=L.querySelector(Q.listaGasto);if(o)for(;o.firstChild;)o.removeChild(o.firstChild);(await f.obtenerTodosLosGastosDB()).forEach(n=>{const{nombre:a,cantidad:r,fecha:t,id:i}=n,d=document.createElement("div");d.className="lista__item",d.dataset.id=i,d.innerHTML=`
                <div class="lista__cantidad">
                    <p class="lista__moneda"><span class="lista__dinero">${r}</span>
                    €</p>
                </div>
                <div class="lista__info">
                    <p class="lista__nombre">${a}</p>
                    <p class="lista__fecha">${t}</p>
                </div>
                <div class="lista__acciones">
                    <button class="button-red" data-id="${i}">X</button>
                    <button class="button-edit" data-id="${i}">🖉</button>
                </div>
            `,o.appendChild(d)}),o.querySelectorAll(".button-red").forEach(n=>{n.addEventListener("click",async a=>{const r=a.target.dataset.id;await f.eliminarGastoDB(r),await T(),await M(),g("Eliminado correctamente","success")})}),o.querySelectorAll(".button-edit").forEach(n=>{n.addEventListener("click",async a=>{const r=a.target.dataset.id,{nombre:t,cantidad:i,fecha:d}=await f.obtenerGastoIDDB(r);document.querySelector("#gasto").value=t,document.querySelector("#cantidad").value=i,document.querySelector("#fecha").value=d,document.querySelector("#id").value=r,document.querySelector(".gasto__button").textContent="Editar"})})},Z=`<h2 class="gasto__title">Añade tus gastos aquí</h2>\r
<form class="gasto__form" id="agregar-gasto" action="#">\r
    \r
    <div class="gasto__field">\r
        <label for="gasto"></label>\r
        <input class="gasto__input" type="text" id="gasto" placeholder="Nombre Gasto">\r
    </div>\r
    <div class="gasto__field">\r
        <label for="cantidad"></label>\r
        <input class="gasto__input" type="text" id="cantidad" placeholder="Cantidad en €">\r
    </div>\r
    <div class="gasto__field">\r
        <label for="fecha"></label>\r
        <input class="gasto__input" type="date" id="fecha" name="fecha">\r
    </div>\r
    <input style="display: none;" type="text" id="id" name="id">\r
    <button class="gasto__button" type="submit">Agregar</button>\r
</form>`;function tt(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var q={exports:{}};/*!
 * Toastify js 1.12.0
 * https://github.com/apvarun/toastify-js
 * @license MIT licensed
 *
 * Copyright (C) 2018 Varun A P
 */var et=q.exports,O;function st(){return O||(O=1,function(s){(function(o,e){s.exports?s.exports=e():o.Toastify=e()})(et,function(o){var e=function(t){return new e.lib.init(t)},n="1.12.0";e.defaults={oldestFirst:!0,text:"Toastify is awesome!",node:void 0,duration:3e3,selector:void 0,callback:function(){},destination:void 0,newWindow:!1,close:!1,gravity:"toastify-top",positionLeft:!1,position:"",backgroundColor:"",avatar:"",className:"",stopOnFocus:!0,onClick:function(){},offset:{x:0,y:0},escapeMarkup:!0,ariaLive:"polite",style:{background:""}},e.lib=e.prototype={toastify:n,constructor:e,init:function(t){return t||(t={}),this.options={},this.toastElement=null,this.options.text=t.text||e.defaults.text,this.options.node=t.node||e.defaults.node,this.options.duration=t.duration===0?0:t.duration||e.defaults.duration,this.options.selector=t.selector||e.defaults.selector,this.options.callback=t.callback||e.defaults.callback,this.options.destination=t.destination||e.defaults.destination,this.options.newWindow=t.newWindow||e.defaults.newWindow,this.options.close=t.close||e.defaults.close,this.options.gravity=t.gravity==="bottom"?"toastify-bottom":e.defaults.gravity,this.options.positionLeft=t.positionLeft||e.defaults.positionLeft,this.options.position=t.position||e.defaults.position,this.options.backgroundColor=t.backgroundColor||e.defaults.backgroundColor,this.options.avatar=t.avatar||e.defaults.avatar,this.options.className=t.className||e.defaults.className,this.options.stopOnFocus=t.stopOnFocus===void 0?e.defaults.stopOnFocus:t.stopOnFocus,this.options.onClick=t.onClick||e.defaults.onClick,this.options.offset=t.offset||e.defaults.offset,this.options.escapeMarkup=t.escapeMarkup!==void 0?t.escapeMarkup:e.defaults.escapeMarkup,this.options.ariaLive=t.ariaLive||e.defaults.ariaLive,this.options.style=t.style||e.defaults.style,t.backgroundColor&&(this.options.style.background=t.backgroundColor),this},buildToast:function(){if(!this.options)throw"Toastify is not initialized";var t=document.createElement("div");t.className="toastify on "+this.options.className,this.options.position?t.className+=" toastify-"+this.options.position:this.options.positionLeft===!0?(t.className+=" toastify-left",console.warn("Property `positionLeft` will be depreciated in further versions. Please use `position` instead.")):t.className+=" toastify-right",t.className+=" "+this.options.gravity,this.options.backgroundColor&&console.warn('DEPRECATION NOTICE: "backgroundColor" is being deprecated. Please use the "style.background" property.');for(var i in this.options.style)t.style[i]=this.options.style[i];if(this.options.ariaLive&&t.setAttribute("aria-live",this.options.ariaLive),this.options.node&&this.options.node.nodeType===Node.ELEMENT_NODE)t.appendChild(this.options.node);else if(this.options.escapeMarkup?t.innerText=this.options.text:t.innerHTML=this.options.text,this.options.avatar!==""){var d=document.createElement("img");d.src=this.options.avatar,d.className="toastify-avatar",this.options.position=="left"||this.options.positionLeft===!0?t.appendChild(d):t.insertAdjacentElement("afterbegin",d)}if(this.options.close===!0){var l=document.createElement("button");l.type="button",l.setAttribute("aria-label","Close"),l.className="toast-close",l.innerHTML="&#10006;",l.addEventListener("click",(function(v){v.stopPropagation(),this.removeElement(this.toastElement),window.clearTimeout(this.toastElement.timeOutValue)}).bind(this));var c=window.innerWidth>0?window.innerWidth:screen.width;(this.options.position=="left"||this.options.positionLeft===!0)&&c>360?t.insertAdjacentElement("afterbegin",l):t.appendChild(l)}if(this.options.stopOnFocus&&this.options.duration>0){var u=this;t.addEventListener("mouseover",function(v){window.clearTimeout(t.timeOutValue)}),t.addEventListener("mouseleave",function(){t.timeOutValue=window.setTimeout(function(){u.removeElement(t)},u.options.duration)})}if(typeof this.options.destination<"u"&&t.addEventListener("click",(function(v){v.stopPropagation(),this.options.newWindow===!0?window.open(this.options.destination,"_blank"):window.location=this.options.destination}).bind(this)),typeof this.options.onClick=="function"&&typeof this.options.destination>"u"&&t.addEventListener("click",(function(v){v.stopPropagation(),this.options.onClick()}).bind(this)),typeof this.options.offset=="object"){var b=a("x",this.options),h=a("y",this.options),y=this.options.position=="left"?b:"-"+b,S=this.options.gravity=="toastify-top"?h:"-"+h;t.style.transform="translate("+y+","+S+")"}return t},showToast:function(){this.toastElement=this.buildToast();var t;if(typeof this.options.selector=="string"?t=document.getElementById(this.options.selector):this.options.selector instanceof HTMLElement||typeof ShadowRoot<"u"&&this.options.selector instanceof ShadowRoot?t=this.options.selector:t=document.body,!t)throw"Root element is not defined";var i=e.defaults.oldestFirst?t.firstChild:t.lastChild;return t.insertBefore(this.toastElement,i),e.reposition(),this.options.duration>0&&(this.toastElement.timeOutValue=window.setTimeout((function(){this.removeElement(this.toastElement)}).bind(this),this.options.duration)),this},hideToast:function(){this.toastElement.timeOutValue&&clearTimeout(this.toastElement.timeOutValue),this.removeElement(this.toastElement)},removeElement:function(t){t.className=t.className.replace(" on",""),window.setTimeout((function(){this.options.node&&this.options.node.parentNode&&this.options.node.parentNode.removeChild(this.options.node),t.parentNode&&t.parentNode.removeChild(t),this.options.callback.call(t),e.reposition()}).bind(this),400)}},e.reposition=function(){for(var t={top:15,bottom:15},i={top:15,bottom:15},d={top:15,bottom:15},l=document.getElementsByClassName("toastify"),c,u=0;u<l.length;u++){r(l[u],"toastify-top")===!0?c="toastify-top":c="toastify-bottom";var b=l[u].offsetHeight;c=c.substr(9,c.length-1);var h=15,y=window.innerWidth>0?window.innerWidth:screen.width;y<=360?(l[u].style[c]=d[c]+"px",d[c]+=b+h):r(l[u],"toastify-left")===!0?(l[u].style[c]=t[c]+"px",t[c]+=b+h):(l[u].style[c]=i[c]+"px",i[c]+=b+h)}return this};function a(t,i){return i.offset[t]?isNaN(i.offset[t])?i.offset[t]:i.offset[t]+"px":"0px"}function r(t,i){return!t||typeof i!="string"?!1:!!(t.className&&t.className.trim().split(/\s+/gi).indexOf(i)>-1)}return e.lib.init.prototype=e.lib,e})}(q)),q.exports}var ot=st();const nt=tt(ot),_={error_all:"Todos los campos son obligatorios",add:"Añadido correctamente",not_number:"Nombre no puede ser un número",number:"Cantidad tiene que ser un número",positive:"Cantidad tiene que ser superior a 0"},N={nombre:"#gasto",monto:"#cantidad",fecha:"#fecha",id:"#id",form:"#agregar-gasto"};let E,at=1,x=0;const rt=async s=>{E=document.createElement("DIV"),E.className="gasto sombras",E.innerHTML=Z,s.append(E),await it()},it=async()=>{const s=E.querySelector(N.form);s.addEventListener("submit",async o=>{o.preventDefault(),await ct(s)})},ct=async s=>{const o=s.querySelector('button[type="submit"]').textContent,e=s.querySelector(N.nombre).value,n=Number(s.querySelector(N.monto).value),a=s.querySelector(N.fecha).value;pt(e,n,a)&&(o==="Editar"?await dt(s,e,n,a):await ut(e,n,a),await lt(s))},dt=async(s,o,e,n)=>{const a=s.querySelector(N.id).value,r={nombre:o,cantidad:e,fecha:n,id:a};await f.actualizarGastoDB(a,r),s.querySelector('button[type="submit"]').textContent="Agregar"},ut=async(s,o,e)=>{const n=new P(s,o,e);await f.guardarGastoDB(n)},lt=async s=>{await M(),await T(),s.reset(),g(_.add,"success")},pt=(s,o,e)=>!s&&!o&&!e?g(_.error_all,"error"):Number(s)?g(_.not_number,"error"):o<=0?g(_.positive,"error"):isNaN(o)?g(_.number,"error"):!s||!o||!e?g(_.error_all,"error"):!0,g=(s,o)=>{x<at&&(x++,nt({text:s,duration:1e3,close:!0,gravity:"top",position:"right",style:{boxShadow:"none",background:o==="success"?"#009933":"#cc0000",color:"white"}}).showToast(),setTimeout(()=>{x--},2e3))},ft=`<div class="info__content sombras">\r
    <div class="info__text" style="border: none;">\r
        <div id="info" class="info__paragraph">\r
            <p>🧠</p>\r
        </div>\r
    </div>\r
</div>\r
<div class="info__content sombras">\r
    <div class="info__text" style="border: none;">\r
        <div id="deleteDB" class="info__paragraph">\r
            <p>🗑️</p>\r
        </div>\r
    </div>\r
</div>\r
<div class="info__content sombras">\r
    <div class="info__text" style="border: none;">\r
        <div id="descargar" class="info__paragraph">\r
            <p>💾</p>\r
        </div>\r
    </div>\r
</div>`,mt=`<div class="layout__modal">\r
    <button class="button-modal">X</button>\r
    <div class="modal__conten_info">\r
        <p class="modal__info__description">Este ejercicio me ha servido para mejorar mis habilidades en JavaScript, HTML/CSS e IndexedDB, además de trabajar en el diseño de una interfaz interactiva y en la gestión de datos locales, con el objetivo de seguir mejorando como\r
            desarrollador web.</p>\r
    </div>\r
    <div class="modal__conten_info">\r
        <p>🗑️: Sirve para eliminar la base de datos, se volverá a cargar la web y te pedira presupuesto.</p>\r
    </div>\r
    <div class="modal__conten_info">\r
        <p>💾: Sirve para exportar tu presupuesto y gastos en un archivo CSV a parte.</p>\r
    </div>\r
    <div class="modal__conten_info footer">\r
        <p>© 2025 MDeosdad<br> Todos los derechos reservados.</p>\r
    </div>\r
</div>`,bt=async s=>{const o=document.createElement("DIV");o.className="info",o.id="presupuesto",o.innerHTML=ft,s.append(o);const e=document.createElement("DIV");e.className="modal_info",e.id="modal_info",e.innerHTML=mt,s.append(e);const n=document.querySelector(".modal_info"),a=document.querySelector("#info"),r=document.querySelector(".button-modal");a.onclick=function(){n.style.display="flex",setTimeout(()=>n.classList.add("show"),300)},r.onclick=function(){n.classList.remove("show"),setTimeout(()=>n.style.display="none",300)},document.querySelector("#deleteDB").addEventListener("click",async()=>{window.confirm("¿Estás seguro de que quieres eliminar la base de datos? Esta acción no se puede deshacer. Se recargara la web automaticamente.")?await f.eliminarBaseDeDatos():console.log("La eliminación fue cancelada.")});const i=(c,u)=>{const b=["descripcion","cantidad","fecha"],h=u.map(v=>[v.nombre,v.cantidad,v.fecha].join(","));return[[`Presupuesto inicial: ${c.presupuesto}`,`Presupuesto restante: ${c.restante}`].join(","),b.join(","),...h].join(`
`)},d=(c,u)=>{const b=i(c,u),h=new Blob([b],{type:"text/csv;charset=utf-8;"}),y=document.createElement("a"),S=URL.createObjectURL(h);y.href=S,y.download="presupuesto_gastos.csv",y.click(),URL.revokeObjectURL(S)};document.querySelector("#descargar").addEventListener("click",async()=>{try{const c=await f.obtenerPresupuestoDB(),u=await f.obtenerTodosLosGastosDB();c&&u&&u.length>0?d(c,u):alert("No hay datos disponibles para exportar.")}catch(c){console.error("Error al obtener los datos para CSV:",c)}})},ht=`<div class="modal__content">\r
    <form>\r
    <h2 class="modal__title">¿Cuál es tu presupuesto?</h2>\r
    <input class="modal__input" type="text" id="presupuesto-input" placeholder="Ingresa tu presupuesto" required>\r
    <button class="modal__button" id="presupuesto-btn">Aceptar</button>\r
    </form>\r
</div>`;let m,D;const vt={inputPresupuesto:"#presupuesto-input"},yt=()=>{m==null||m.classList.remove("hidden")},gt=()=>{m==null||m.classList.add("hidden"),D==null||D.reset()},wt=async(s,o)=>{o?(await M(),await T()):(m=document.createElement("DIV"),m.className="modal modal--presupuesto hidden",m.id="modal-presupuesto",m.innerHTML=ht,yt(),D=m.querySelector("form"),D.addEventListener("submit",async e=>{e.preventDefault();const n=Number(m.querySelector(vt.inputPresupuesto).value);if(!n||isNaN(n)||n<=0){g("El presupuesto no es valido","error");return}const a=new j(n,n);await f.guardarPresupuestoDB(a),await T(),gt()}),s.append(m))},B={interfazIzq:"#layout1",interfazDer:"#layout2"},_t=async s=>{const o=document.createElement("div");o.innerHTML=I,s.append(o),await f.openDB();const e=await f.obtenerPresupuestoDB(),n=s.querySelector(B.interfazIzq),a=s.querySelector(B.interfazDer);rt(n),X(n),Y(a),bt(n),wt(s,e)},St=document.querySelector("#app");_t(St);
