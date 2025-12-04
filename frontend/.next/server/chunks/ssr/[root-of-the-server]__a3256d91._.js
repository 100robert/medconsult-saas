module.exports=[24361,(a,b,c)=>{b.exports=a.x("util",()=>require("util"))},14747,(a,b,c)=>{b.exports=a.x("path",()=>require("path"))},660,(a,b,c)=>{"use strict";b.exports=a.r(65199).vendored.contexts.HooksClientContext},21129,(a,b,c)=>{"use strict";b.exports=a.r(65199).vendored.contexts.ServerInsertedHtml},18622,(a,b,c)=>{b.exports=a.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},20635,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},65199,(a,b,c)=>{"use strict";b.exports=a.r(18622)},32445,(a,b,c)=>{"use strict";b.exports=a.r(65199).vendored["react-ssr"].ReactJsxRuntime},56491,(a,b,c)=>{"use strict";b.exports=a.r(65199).vendored["react-ssr"].React},12389,(a,b,c)=>{"use strict";b.exports=a.r(65199).vendored.contexts.AppRouterContext},80363,(a,b,c)=>{"use strict";b.exports=a.r(65199).vendored["react-ssr"].ReactServerDOMTurbopackClient},82743,a=>{"use strict";let b=(0,a.i(47904).default)("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);a.s(["CheckCircle",()=>b],82743)},47904,a=>{"use strict";var b=a.i(56491);let c=(...a)=>a.filter((a,b,c)=>!!a&&""!==a.trim()&&c.indexOf(a)===b).join(" ").trim();var d={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let e=(0,b.forwardRef)(({color:a="currentColor",size:e=24,strokeWidth:f=2,absoluteStrokeWidth:g,className:h="",children:i,iconNode:j,...k},l)=>(0,b.createElement)("svg",{ref:l,...d,width:e,height:e,stroke:a,strokeWidth:g?24*Number(f)/Number(e):f,className:c("lucide",h),...k},[...j.map(([a,c])=>(0,b.createElement)(a,c)),...Array.isArray(i)?i:[i]])),f=(a,d)=>{let f=(0,b.forwardRef)(({className:f,...g},h)=>(0,b.createElement)(e,{ref:h,iconNode:d,className:c(`lucide-${a.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,f),...g}));return f.displayName=`${a}`,f};a.s(["default",()=>f],47904)},19814,a=>{"use strict";let b=(0,a.i(47904).default)("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);a.s(["X",()=>b],19814)},73043,64780,a=>{"use strict";var b=a.i(32445),c=a.i(56491);let d=(0,a.i(47904).default)("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]),e=(0,c.forwardRef)(({children:a,className:c="",variant:e="primary",size:f="md",isLoading:g=!1,leftIcon:h,rightIcon:i,glow:j=!1,disabled:k,...l},m)=>{let n=`
      inline-flex items-center justify-center font-semibold rounded-2xl
      transition-all duration-300 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      active:scale-[0.98]
    `,o={primary:`
        bg-gradient-to-r from-blue-500 to-blue-600 text-white
        hover:shadow-[0_8px_30px_rgba(46,108,253,0.35)]
        hover:-translate-y-1
        focus:ring-blue-500
      `,secondary:`
        bg-white/10 backdrop-blur-md text-white
        border border-white/30
        hover:bg-white/20 hover:-translate-y-1
        focus:ring-white/50
      `,outline:`
        border-2 border-blue-500/30 text-blue-600 bg-white/80 backdrop-blur-sm
        hover:border-blue-500 hover:bg-blue-500/5 hover:-translate-y-1
        focus:ring-blue-500
      `,ghost:`
        text-gray-600 bg-transparent
        hover:bg-white/50 hover:text-gray-900
        focus:ring-gray-500
      `,danger:`
        bg-gradient-to-r from-red-500 to-rose-600 text-white
        hover:shadow-[0_8px_30px_rgba(239,68,68,0.5)]
        hover:-translate-y-1
        focus:ring-red-500
      `,gradient:`
        bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 text-white
        hover:shadow-[0_8px_30px_rgba(46,108,253,0.35)]
        hover:-translate-y-1
        focus:ring-blue-500
        bg-[length:200%_200%] animate-[gradient-shift_3s_ease_infinite]
      `,glass:`
        bg-white/15 backdrop-blur-xl text-white
        border border-white/30
        shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]
        hover:bg-white/25 hover:-translate-y-1
        hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.15)]
        focus:ring-white/50
      `};return(0,b.jsxs)("button",{ref:m,className:`${n} ${o[e]} ${{sm:"px-4 py-2 text-sm gap-1.5",md:"px-6 py-3 text-sm gap-2",lg:"px-8 py-3.5 text-base gap-2",xl:"px-10 py-4 text-lg gap-2.5"}[f]} ${j?"animate-pulse-glow":""} ${c}`,disabled:k||g,...l,children:[g?(0,b.jsx)(d,{className:"w-5 h-5 animate-spin"}):h?(0,b.jsx)("span",{className:"flex-shrink-0",children:h}):null,a,i&&!g&&(0,b.jsx)("span",{className:"flex-shrink-0",children:i})]})});e.displayName="Button",a.s(["default",0,e],73043);let f=(0,c.forwardRef)(({label:a,error:c,helperText:d,leftIcon:e,rightIcon:f,variant:g="default",className:h="",id:i,...j},k)=>{let l=i||j.name,m={default:`
        bg-white border-2 border-gray-200
        focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
        hover:border-gray-300
      `,glass:`
        bg-white/20 backdrop-blur-xl border border-white/30
        text-white placeholder:text-white/60
        focus:bg-white/30 focus:border-white/50
        focus:shadow-[0_0_20px_rgba(46,108,253,0.3)]
      `,"glass-light":`
        bg-white/90 backdrop-blur-xl border-2 border-blue-500/10
        focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10
        hover:border-blue-500/30
      `};return(0,b.jsxs)("div",{className:"w-full",children:[a&&(0,b.jsx)("label",{htmlFor:l,className:`block text-sm font-semibold mb-2 ${"glass"===g?"text-white/90":"text-gray-700"}`,children:a}),(0,b.jsxs)("div",{className:"relative group",children:[e&&(0,b.jsx)("div",{className:`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${"glass"===g?"text-white/60 group-focus-within:text-white":"text-gray-400 group-focus-within:text-blue-500"}`,children:e}),(0,b.jsx)("input",{ref:k,id:l,className:`
              block w-full rounded-2xl
              transition-all duration-300 ease-out
              ${e?"pl-12":"pl-4"}
              ${f?"pr-12":"pr-4"}
              py-3.5
              ${m[g]}
              ${c&&"default"===g?"!border-red-300 focus:!border-red-500 focus:!ring-red-500/10":""}
              focus:outline-none
              ${"glass"===g?"":"placeholder:text-gray-400"}
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${h}
            `,"aria-invalid":!!c,...j}),f&&(0,b.jsx)("div",{className:`absolute inset-y-0 right-0 pr-4 flex items-center ${"glass"===g?"text-white/60":"text-gray-400"}`,children:f})]}),c&&(0,b.jsxs)("p",{className:"mt-2 text-sm text-red-500 flex items-center gap-1.5",children:[(0,b.jsx)("svg",{className:"w-4 h-4",fill:"currentColor",viewBox:"0 0 20 20",children:(0,b.jsx)("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",clipRule:"evenodd"})}),c]}),d&&!c&&(0,b.jsx)("p",{className:`mt-2 text-sm ${"glass"===g?"text-white/70":"text-gray-500"}`,children:d})]})});f.displayName="Input",a.s(["default",0,f],64780)},42788,a=>{"use strict";let b=(0,a.i(47904).default)("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);a.s(["AlertCircle",()=>b],42788)},46992,a=>{"use strict";let b=(0,a.i(47904).default)("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);a.s(["Info",()=>b],46992)},50734,a=>{"use strict";let b=(0,a.i(47904).default)("CircleX",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);a.s(["XCircle",()=>b],50734)},7277,61501,1513,92631,a=>{"use strict";a.i(73043),a.i(64780);var b=a.i(32445),c=a.i(42788),d=a.i(82743),e=a.i(46992),f=a.i(50734),g=a.i(19814);function h({children:a,variant:h="info",title:i,onClose:j,className:k=""}){let{bg:l,border:m,text:n,icon:o}={info:{bg:"bg-blue-50",border:"border-blue-200",text:"text-blue-800",icon:(0,b.jsx)(e.Info,{className:"w-5 h-5 text-blue-500"})},success:{bg:"bg-green-50",border:"border-green-200",text:"text-green-800",icon:(0,b.jsx)(d.CheckCircle,{className:"w-5 h-5 text-green-500"})},warning:{bg:"bg-yellow-50",border:"border-yellow-200",text:"text-yellow-800",icon:(0,b.jsx)(c.AlertCircle,{className:"w-5 h-5 text-yellow-500"})},error:{bg:"bg-red-50",border:"border-red-200",text:"text-red-800",icon:(0,b.jsx)(f.XCircle,{className:"w-5 h-5 text-red-500"})}}[h];return(0,b.jsx)("div",{className:`${l} ${m} ${n} border rounded-lg p-4 ${k}`,role:"alert",children:(0,b.jsxs)("div",{className:"flex",children:[(0,b.jsx)("div",{className:"flex-shrink-0",children:o}),(0,b.jsxs)("div",{className:"ml-3 flex-1",children:[i&&(0,b.jsx)("h3",{className:"font-medium",children:i}),(0,b.jsx)("div",{className:i?"mt-1 text-sm":"text-sm",children:a})]}),j&&(0,b.jsx)("button",{onClick:j,className:"flex-shrink-0 ml-4 inline-flex text-current hover:opacity-75",children:(0,b.jsx)(g.X,{className:"w-5 h-5"})})]})})}function i({children:a,className:c="",variant:d="default",size:e="md",hover:f=!0,glow:g=!1,glowColor:h="blue",blur:i="md",icon:j,iconBg:k="gradient-primary",...l}){let m={default:`
      bg-white/15 
      border border-white/30
      shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]
    `,light:`
      bg-white/85
      border border-white/50
      shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]
    `,dark:`
      bg-gray-900/80
      border border-white/10
      shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
      text-white
    `,gradient:`
      bg-gradient-to-br from-white/20 to-white/5
      border border-white/30
      shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]
    `};return(0,b.jsxs)("div",{className:`
        ${m[d]}
        ${{sm:"p-4 rounded-xl",md:"p-6 rounded-2xl",lg:"p-8 rounded-3xl",xl:"p-10 rounded-3xl"}[e]}
        ${{sm:"backdrop-blur-sm",md:"backdrop-blur-xl",lg:"backdrop-blur-2xl"}[i]}
        ${g?({blue:"shadow-[0_0_30px_rgba(46,108,253,0.3)]",green:"shadow-[0_0_30px_rgba(34,197,94,0.3)]",purple:"shadow-[0_0_30px_rgba(185,162,232,0.3)]"})[h]:""}
        ${f?"hover:-translate-y-2 hover:shadow-[0_20px_50px_0_rgba(0,0,0,0.15)]":""}
        transition-all duration-300
        ${c}
      `,...l,children:[j&&(0,b.jsx)("div",{className:`
          w-14 h-14 rounded-2xl ${k} 
          flex items-center justify-center mb-4
          shadow-lg
        `,children:j}),a]})}function j({children:a,className:c="",padding:d="md",hover:e=!1,gradient:f=!1}){return(0,b.jsx)("div",{className:`
        bg-white rounded-2xl border border-gray-100 
        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.05)]
        ${e?"transition-all duration-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] hover:border-gray-200 hover:-translate-y-1":""}
        ${f?"bg-gradient-to-br from-white to-gray-50/50":""}
        ${{none:"",sm:"p-4",md:"p-6",lg:"p-8"}[d]} 
        ${c}
      `,children:a})}function k({children:a,className:c=""}){return(0,b.jsx)("div",{className:`border-b border-gray-100 pb-5 mb-5 ${c}`,children:a})}function l({children:a,className:c=""}){return(0,b.jsx)("h3",{className:`text-xl font-bold text-gray-900 ${c}`,children:a})}function m({children:a,className:c=""}){return(0,b.jsx)("p",{className:`text-sm text-gray-500 mt-1.5 ${c}`,children:a})}function n({children:a,className:c=""}){return(0,b.jsx)("div",{className:c,children:a})}a.s(["default",()=>h],61501),a.s(["default",()=>i],1513),a.s(["Card",()=>j,"CardContent",()=>n,"CardDescription",()=>m,"CardHeader",()=>k,"CardTitle",()=>l],92631),a.s([],7277)},58468,a=>{"use strict";var b=a.i(73043);a.s(["Button",()=>b.default])},21158,a=>{"use strict";let b=(0,a.i(47904).default)("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);a.s(["Calendar",()=>b],21158)},45953,a=>{"use strict";let b=(0,a.i(47904).default)("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);a.s(["User",()=>b],45953)},19509,a=>{"use strict";let b=(0,a.i(47904).default)("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);a.s(["Clock",()=>b],19509)},25949,a=>{"use strict";let b=(0,a.i(47904).default)("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]]);a.s(["Heart",()=>b],25949)},29482,a=>{"use strict";let b=(0,a.i(47904).default)("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]);a.s(["Sparkles",()=>b],29482)},91307,a=>{"use strict";let b=(0,a.i(47904).default)("Award",[["path",{d:"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",key:"1yiouv"}],["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}]]);a.s(["Award",()=>b],91307)},35649,a=>{"use strict";let b=(0,a.i(47904).default)("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);a.s(["Mail",()=>b],35649)},57495,a=>{"use strict";let b=(0,a.i(47904).default)("Phone",[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);a.s(["Phone",()=>b],57495)},73803,21492,61987,a=>{"use strict";var b=a.i(47904);let c=(0,b.default)("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);a.s(["Lock",()=>c],73803);let d=(0,b.default)("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);a.s(["Eye",()=>d],21492);let e=(0,b.default)("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);a.s(["EyeOff",()=>e],61987)},68661,a=>{"use strict";let b=(0,a.i(47904).default)("Stethoscope",[["path",{d:"M11 2v2",key:"1539x4"}],["path",{d:"M5 2v2",key:"1yf1q8"}],["path",{d:"M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1",key:"rb5t3r"}],["path",{d:"M8 15a6 6 0 0 0 12 0v-3",key:"x18d4x"}],["circle",{cx:"20",cy:"10",r:"2",key:"ts1r5v"}]]);a.s(["Stethoscope",()=>b],68661)},67759,a=>{"use strict";let b=(0,a.i(47904).default)("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);a.s(["Shield",()=>b],67759)},97202,a=>{"use strict";var b=a.i(32445),c=a.i(56491),d=a.i(7948),e=a.i(4378),f=a.i(40666),g=c,h=a.i(53430);class i extends g.Component{getSnapshotBeforeUpdate(a){let b=this.props.childRef.current;if(b&&a.isPresent&&!this.props.isPresent){let a=this.props.sizeRef.current;a.height=b.offsetHeight||0,a.width=b.offsetWidth||0,a.top=b.offsetTop,a.left=b.offsetLeft}return null}componentDidUpdate(){}render(){return this.props.children}}function j({children:a,isPresent:c}){let d=(0,g.useId)(),e=(0,g.useRef)(null),f=(0,g.useRef)({width:0,height:0,top:0,left:0}),{nonce:j}=(0,g.useContext)(h.MotionConfigContext);return(0,g.useInsertionEffect)(()=>{let{width:a,height:b,top:g,left:h}=f.current;if(c||!e.current||!a||!b)return;e.current.dataset.motionPopId=d;let i=document.createElement("style");return j&&(i.nonce=j),document.head.appendChild(i),i.sheet&&i.sheet.insertRule(`
          [data-motion-pop-id="${d}"] {
            position: absolute !important;
            width: ${a}px !important;
            height: ${b}px !important;
            top: ${g}px !important;
            left: ${h}px !important;
          }
        `),()=>{document.head.removeChild(i)}},[c]),(0,b.jsx)(i,{isPresent:c,childRef:e,sizeRef:f,children:g.cloneElement(a,{ref:e})})}let k=({children:a,initial:d,isPresent:g,onExitComplete:h,custom:i,presenceAffectsLayout:k,mode:m})=>{let n=(0,e.useConstant)(l),o=(0,c.useId)(),p=(0,c.useCallback)(a=>{for(let b of(n.set(a,!0),n.values()))if(!b)return;h&&h()},[n,h]),q=(0,c.useMemo)(()=>({id:o,initial:d,isPresent:g,custom:i,onExitComplete:p,register:a=>(n.set(a,!1),()=>n.delete(a))}),k?[Math.random(),p]:[g,p]);return(0,c.useMemo)(()=>{n.forEach((a,b)=>n.set(b,!1))},[g]),c.useEffect(()=>{g||n.size||!h||h()},[g]),"popLayout"===m&&(a=(0,b.jsx)(j,{isPresent:g,children:a})),(0,b.jsx)(f.PresenceContext.Provider,{value:q,children:a})};function l(){return new Map}var m=a.i(84589);let n=a=>a.key||"";function o(a){let b=[];return c.Children.forEach(a,a=>{(0,c.isValidElement)(a)&&b.push(a)}),b}var p=a.i(89678);let q=({children:a,custom:f,initial:g=!0,onExitComplete:h,presenceAffectsLayout:i=!0,mode:j="sync",propagate:l=!1})=>{let[q,r]=(0,m.usePresence)(l),s=(0,c.useMemo)(()=>o(a),[a]),t=l&&!q?[]:s.map(n),u=(0,c.useRef)(!0),v=(0,c.useRef)(s),w=(0,e.useConstant)(()=>new Map),[x,y]=(0,c.useState)(s),[z,A]=(0,c.useState)(s);(0,p.useIsomorphicLayoutEffect)(()=>{u.current=!1,v.current=s;for(let a=0;a<z.length;a++){let b=n(z[a]);t.includes(b)?w.delete(b):!0!==w.get(b)&&w.set(b,!1)}},[z,t.length,t.join("-")]);let B=[];if(s!==x){let a=[...s];for(let b=0;b<z.length;b++){let c=z[b],d=n(c);t.includes(d)||(a.splice(b,0,c),B.push(c))}"wait"===j&&B.length&&(a=B),A(o(a)),y(s);return}let{forceRender:C}=(0,c.useContext)(d.LayoutGroupContext);return(0,b.jsx)(b.Fragment,{children:z.map(a=>{let c=n(a),d=(!l||!!q)&&(s===z||t.includes(c));return(0,b.jsx)(k,{isPresent:d,initial:(!u.current||!!g)&&void 0,custom:d?void 0:f,presenceAffectsLayout:i,mode:j,onExitComplete:d?void 0:()=>{if(!w.has(c))return;w.set(c,!0);let a=!0;w.forEach(b=>{b||(a=!1)}),a&&(null==C||C(),A(v.current),l&&(null==r||r()),h&&h())},children:a},c)})})};a.s(["AnimatePresence",()=>q],97202)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__a3256d91._.js.map