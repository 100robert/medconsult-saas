module.exports=[96106,(a,b,c)=>{"use strict";b.exports=a.r(65199).vendored["react-ssr"].ReactDOM},82743,a=>{"use strict";let b=(0,a.i(47904).default)("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);a.s(["CheckCircle",()=>b],82743)},42788,a=>{"use strict";let b=(0,a.i(47904).default)("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);a.s(["AlertCircle",()=>b],42788)},73043,64780,a=>{"use strict";var b=a.i(32445),c=a.i(56491);let d=(0,a.i(47904).default)("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]),e=(0,c.forwardRef)(({children:a,className:c="",variant:e="primary",size:f="md",isLoading:g=!1,leftIcon:h,rightIcon:i,glow:j=!1,disabled:k,...l},m)=>{let n=`
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
            `,"aria-invalid":!!c,...j}),f&&(0,b.jsx)("div",{className:`absolute inset-y-0 right-0 pr-4 flex items-center ${"glass"===g?"text-white/60":"text-gray-400"}`,children:f})]}),c&&(0,b.jsxs)("p",{className:"mt-2 text-sm text-red-500 flex items-center gap-1.5",children:[(0,b.jsx)("svg",{className:"w-4 h-4",fill:"currentColor",viewBox:"0 0 20 20",children:(0,b.jsx)("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",clipRule:"evenodd"})}),c]}),d&&!c&&(0,b.jsx)("p",{className:`mt-2 text-sm ${"glass"===g?"text-white/70":"text-gray-500"}`,children:d})]})});f.displayName="Input",a.s(["default",0,f],64780)},46992,a=>{"use strict";let b=(0,a.i(47904).default)("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);a.s(["Info",()=>b],46992)},50734,a=>{"use strict";let b=(0,a.i(47904).default)("CircleX",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);a.s(["XCircle",()=>b],50734)},7277,61501,1513,92631,a=>{"use strict";a.i(73043),a.i(64780);var b=a.i(32445),c=a.i(42788),d=a.i(82743),e=a.i(46992),f=a.i(50734),g=a.i(19814);function h({children:a,variant:h="info",title:i,onClose:j,className:k=""}){let{bg:l,border:m,text:n,icon:o}={info:{bg:"bg-blue-50",border:"border-blue-200",text:"text-blue-800",icon:(0,b.jsx)(e.Info,{className:"w-5 h-5 text-blue-500"})},success:{bg:"bg-green-50",border:"border-green-200",text:"text-green-800",icon:(0,b.jsx)(d.CheckCircle,{className:"w-5 h-5 text-green-500"})},warning:{bg:"bg-yellow-50",border:"border-yellow-200",text:"text-yellow-800",icon:(0,b.jsx)(c.AlertCircle,{className:"w-5 h-5 text-yellow-500"})},error:{bg:"bg-red-50",border:"border-red-200",text:"text-red-800",icon:(0,b.jsx)(f.XCircle,{className:"w-5 h-5 text-red-500"})}}[h];return(0,b.jsx)("div",{className:`${l} ${m} ${n} border rounded-lg p-4 ${k}`,role:"alert",children:(0,b.jsxs)("div",{className:"flex",children:[(0,b.jsx)("div",{className:"flex-shrink-0",children:o}),(0,b.jsxs)("div",{className:"ml-3 flex-1",children:[i&&(0,b.jsx)("h3",{className:"font-medium",children:i}),(0,b.jsx)("div",{className:i?"mt-1 text-sm":"text-sm",children:a})]}),j&&(0,b.jsx)("button",{onClick:j,className:"flex-shrink-0 ml-4 inline-flex text-current hover:opacity-75",children:(0,b.jsx)(g.X,{className:"w-5 h-5"})})]})})}function i({children:a,className:c="",variant:d="default",size:e="md",hover:f=!0,glow:g=!1,glowColor:h="blue",blur:i="md",icon:j,iconBg:k="gradient-primary",...l}){let m={default:`
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
      `,children:a})}function k({children:a,className:c=""}){return(0,b.jsx)("div",{className:`border-b border-gray-100 pb-5 mb-5 ${c}`,children:a})}function l({children:a,className:c=""}){return(0,b.jsx)("h3",{className:`text-xl font-bold text-gray-900 ${c}`,children:a})}function m({children:a,className:c=""}){return(0,b.jsx)("p",{className:`text-sm text-gray-500 mt-1.5 ${c}`,children:a})}function n({children:a,className:c=""}){return(0,b.jsx)("div",{className:c,children:a})}a.s(["default",()=>h],61501),a.s(["default",()=>i],1513),a.s(["Card",()=>j,"CardContent",()=>n,"CardDescription",()=>m,"CardHeader",()=>k,"CardTitle",()=>l],92631),a.s([],7277)},19509,a=>{"use strict";let b=(0,a.i(47904).default)("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);a.s(["Clock",()=>b],19509)},47833,a=>{"use strict";let b=(0,a.i(47904).default)("Star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]);a.s(["Star",()=>b],47833)},65516,a=>{"use strict";let b=(0,a.i(47904).default)("Activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);a.s(["Activity",()=>b],65516)}];

//# sourceMappingURL=OneDrive_Escritorio_medconsult-saas_frontend_2e761709._.js.map