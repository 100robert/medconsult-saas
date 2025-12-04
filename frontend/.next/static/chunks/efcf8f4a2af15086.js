(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,30,e=>{"use strict";let r=(0,e.i(79191).default)("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);e.s(["Clock",()=>r],30)},41986,e=>{"use strict";let r=(0,e.i(79191).default)("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);e.s(["CheckCircle",()=>r],41986)},21906,11441,e=>{"use strict";var r=e.i(98781),a=e.i(78271);let t=(0,e.i(79191).default)("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]),s=(0,a.forwardRef)(({children:e,className:a="",variant:s="primary",size:l="md",isLoading:i=!1,leftIcon:o,rightIcon:d,glow:n=!1,disabled:c,...x},m)=>{let h=`
      inline-flex items-center justify-center font-semibold rounded-2xl
      transition-all duration-300 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      active:scale-[0.98]
    `,u={primary:`
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
      `};return(0,r.jsxs)("button",{ref:m,className:`${h} ${u[s]} ${{sm:"px-4 py-2 text-sm gap-1.5",md:"px-6 py-3 text-sm gap-2",lg:"px-8 py-3.5 text-base gap-2",xl:"px-10 py-4 text-lg gap-2.5"}[l]} ${n?"animate-pulse-glow":""} ${a}`,disabled:c||i,...x,children:[i?(0,r.jsx)(t,{className:"w-5 h-5 animate-spin"}):o?(0,r.jsx)("span",{className:"flex-shrink-0",children:o}):null,e,d&&!i&&(0,r.jsx)("span",{className:"flex-shrink-0",children:d})]})});s.displayName="Button",e.s(["default",0,s],21906);let l=(0,a.forwardRef)(({label:e,error:a,helperText:t,leftIcon:s,rightIcon:l,variant:i="default",className:o="",id:d,...n},c)=>{let x=d||n.name,m={default:`
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
      `};return(0,r.jsxs)("div",{className:"w-full",children:[e&&(0,r.jsx)("label",{htmlFor:x,className:`block text-sm font-semibold mb-2 ${"glass"===i?"text-white/90":"text-gray-700"}`,children:e}),(0,r.jsxs)("div",{className:"relative group",children:[s&&(0,r.jsx)("div",{className:`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${"glass"===i?"text-white/60 group-focus-within:text-white":"text-gray-400 group-focus-within:text-blue-500"}`,children:s}),(0,r.jsx)("input",{ref:c,id:x,className:`
              block w-full rounded-2xl
              transition-all duration-300 ease-out
              ${s?"pl-12":"pl-4"}
              ${l?"pr-12":"pr-4"}
              py-3.5
              ${m[i]}
              ${a&&"default"===i?"!border-red-300 focus:!border-red-500 focus:!ring-red-500/10":""}
              focus:outline-none
              ${"glass"===i?"":"placeholder:text-gray-400"}
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${o}
            `,"aria-invalid":!!a,...n}),l&&(0,r.jsx)("div",{className:`absolute inset-y-0 right-0 pr-4 flex items-center ${"glass"===i?"text-white/60":"text-gray-400"}`,children:l})]}),a&&(0,r.jsxs)("p",{className:"mt-2 text-sm text-red-500 flex items-center gap-1.5",children:[(0,r.jsx)("svg",{className:"w-4 h-4",fill:"currentColor",viewBox:"0 0 20 20",children:(0,r.jsx)("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",clipRule:"evenodd"})}),a]}),t&&!a&&(0,r.jsx)("p",{className:`mt-2 text-sm ${"glass"===i?"text-white/70":"text-gray-500"}`,children:t})]})});l.displayName="Input",e.s(["default",0,l],11441)},66173,e=>{"use strict";let r=(0,e.i(79191).default)("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);e.s(["AlertCircle",()=>r],66173)},9649,e=>{"use strict";let r=(0,e.i(79191).default)("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);e.s(["Info",()=>r],9649)},13950,e=>{"use strict";let r=(0,e.i(79191).default)("CircleX",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);e.s(["XCircle",()=>r],13950)},69337,99160,11523,41460,e=>{"use strict";e.i(21906),e.i(11441);var r=e.i(98781),a=e.i(66173),t=e.i(41986),s=e.i(9649),l=e.i(13950),i=e.i(91481);function o({children:e,variant:o="info",title:d,onClose:n,className:c=""}){let{bg:x,border:m,text:h,icon:u}={info:{bg:"bg-blue-50",border:"border-blue-200",text:"text-blue-800",icon:(0,r.jsx)(s.Info,{className:"w-5 h-5 text-blue-500"})},success:{bg:"bg-green-50",border:"border-green-200",text:"text-green-800",icon:(0,r.jsx)(t.CheckCircle,{className:"w-5 h-5 text-green-500"})},warning:{bg:"bg-yellow-50",border:"border-yellow-200",text:"text-yellow-800",icon:(0,r.jsx)(a.AlertCircle,{className:"w-5 h-5 text-yellow-500"})},error:{bg:"bg-red-50",border:"border-red-200",text:"text-red-800",icon:(0,r.jsx)(l.XCircle,{className:"w-5 h-5 text-red-500"})}}[o];return(0,r.jsx)("div",{className:`${x} ${m} ${h} border rounded-lg p-4 ${c}`,role:"alert",children:(0,r.jsxs)("div",{className:"flex",children:[(0,r.jsx)("div",{className:"flex-shrink-0",children:u}),(0,r.jsxs)("div",{className:"ml-3 flex-1",children:[d&&(0,r.jsx)("h3",{className:"font-medium",children:d}),(0,r.jsx)("div",{className:d?"mt-1 text-sm":"text-sm",children:e})]}),n&&(0,r.jsx)("button",{onClick:n,className:"flex-shrink-0 ml-4 inline-flex text-current hover:opacity-75",children:(0,r.jsx)(i.X,{className:"w-5 h-5"})})]})})}function d({children:e,className:a="",variant:t="default",size:s="md",hover:l=!0,glow:i=!1,glowColor:o="blue",blur:d="md",icon:n,iconBg:c="gradient-primary",...x}){let m={default:`
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
    `};return(0,r.jsxs)("div",{className:`
        ${m[t]}
        ${{sm:"p-4 rounded-xl",md:"p-6 rounded-2xl",lg:"p-8 rounded-3xl",xl:"p-10 rounded-3xl"}[s]}
        ${{sm:"backdrop-blur-sm",md:"backdrop-blur-xl",lg:"backdrop-blur-2xl"}[d]}
        ${i?({blue:"shadow-[0_0_30px_rgba(46,108,253,0.3)]",green:"shadow-[0_0_30px_rgba(34,197,94,0.3)]",purple:"shadow-[0_0_30px_rgba(185,162,232,0.3)]"})[o]:""}
        ${l?"hover:-translate-y-2 hover:shadow-[0_20px_50px_0_rgba(0,0,0,0.15)]":""}
        transition-all duration-300
        ${a}
      `,...x,children:[n&&(0,r.jsx)("div",{className:`
          w-14 h-14 rounded-2xl ${c} 
          flex items-center justify-center mb-4
          shadow-lg
        `,children:n}),e]})}function n({children:e,className:a="",padding:t="md",hover:s=!1,gradient:l=!1}){return(0,r.jsx)("div",{className:`
        bg-white rounded-2xl border border-gray-100 
        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.05)]
        ${s?"transition-all duration-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] hover:border-gray-200 hover:-translate-y-1":""}
        ${l?"bg-gradient-to-br from-white to-gray-50/50":""}
        ${{none:"",sm:"p-4",md:"p-6",lg:"p-8"}[t]} 
        ${a}
      `,children:e})}function c({children:e,className:a=""}){return(0,r.jsx)("div",{className:`border-b border-gray-100 pb-5 mb-5 ${a}`,children:e})}function x({children:e,className:a=""}){return(0,r.jsx)("h3",{className:`text-xl font-bold text-gray-900 ${a}`,children:e})}function m({children:e,className:a=""}){return(0,r.jsx)("p",{className:`text-sm text-gray-500 mt-1.5 ${a}`,children:e})}function h({children:e,className:a=""}){return(0,r.jsx)("div",{className:a,children:e})}e.s(["default",()=>o],99160),e.s(["default",()=>d],11523),e.s(["Card",()=>n,"CardContent",()=>h,"CardDescription",()=>m,"CardHeader",()=>c,"CardTitle",()=>x],41460),e.s([],69337)},46853,e=>{"use strict";var r=e.i(21906);e.s(["Button",()=>r.default])},77063,e=>{"use strict";let r=(0,e.i(79191).default)("Video",[["path",{d:"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",key:"ftymec"}],["rect",{x:"2",y:"6",width:"14",height:"12",rx:"2",key:"158x01"}]]);e.s(["Video",()=>r],77063)},88910,e=>{"use strict";let r=(0,e.i(79191).default)("Star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]);e.s(["Star",()=>r],88910)},22725,e=>{"use strict";let r=(0,e.i(79191).default)("Award",[["path",{d:"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",key:"1yiouv"}],["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}]]);e.s(["Award",()=>r],22725)},48152,e=>{"use strict";var r=e.i(98781),a=e.i(78271),t=e.i(72736),s=e.i(73540),l=e.i(70032),i=e.i(88910),o=e.i(30),d=e.i(77063),n=e.i(79191);let c=(0,n.default)("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]),x=(0,n.default)("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]]);var m=e.i(27472),h=e.i(84672),u=e.i(22725);let p=(0,n.default)("GraduationCap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);e.i(69337);var g=e.i(46853);let b=[{id:"1",nombre:"Carlos",apellido:"Mendoza",especialidad:"Cardiología",calificacion:4.9,numReviews:124,precio:50,proximaDisponibilidad:"Hoy, 3:00 PM",verificado:!0,videoConsulta:!0,experiencia:15},{id:"2",nombre:"María",apellido:"García",especialidad:"Dermatología",calificacion:4.8,numReviews:89,precio:45,proximaDisponibilidad:"Mañana, 10:00 AM",verificado:!0,videoConsulta:!0,experiencia:12},{id:"3",nombre:"Pedro",apellido:"Ramírez",especialidad:"Medicina General",calificacion:4.7,numReviews:156,precio:35,proximaDisponibilidad:"Hoy, 5:00 PM",verificado:!0,videoConsulta:!1,experiencia:8},{id:"4",nombre:"Ana",apellido:"López",especialidad:"Pediatría",calificacion:4.9,numReviews:203,precio:40,proximaDisponibilidad:"Mañana, 9:00 AM",verificado:!0,videoConsulta:!0,experiencia:10}],f=["Todas","Medicina General","Cardiología","Dermatología","Pediatría","Neurología","Traumatología","Ginecología","Oftalmología"];function y(){(0,t.useRouter)();let[e]=(0,a.useState)(b),[n,y]=(0,a.useState)(""),[w,v]=(0,a.useState)("Todas"),j=e.filter(e=>{let r=e.nombre.toLowerCase().includes(n.toLowerCase())||e.apellido.toLowerCase().includes(n.toLowerCase())||e.especialidad.toLowerCase().includes(n.toLowerCase()),a="Todas"===w||e.especialidad===w;return r&&a});return(0,r.jsxs)("div",{className:"space-y-6",children:[(0,r.jsx)("div",{className:"flex flex-col md:flex-row md:items-end md:justify-between gap-4",children:(0,r.jsxs)("div",{children:[(0,r.jsxs)("div",{className:"inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-2",children:[(0,r.jsx)(m.Sparkles,{className:"w-4 h-4"}),"500+ especialistas"]}),(0,r.jsx)("h1",{className:"text-3xl font-bold text-gray-900",children:"Buscar Médicos"}),(0,r.jsx)("p",{className:"text-gray-600 mt-1",children:"Encuentra al especialista que necesitas y agenda tu cita"})]})}),(0,r.jsxs)("div",{className:"bg-white rounded-2xl shadow-sm border border-gray-100 p-6",children:[(0,r.jsxs)("div",{className:"flex flex-col lg:flex-row gap-4",children:[(0,r.jsxs)("div",{className:"flex-1 relative",children:[(0,r.jsx)(l.Search,{className:"absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"}),(0,r.jsx)("input",{type:"text",placeholder:"Buscar por nombre o especialidad...",value:n,onChange:e=>y(e.target.value),className:"w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-900 placeholder-gray-400"})]}),(0,r.jsxs)("div",{className:"flex items-center gap-2",children:[(0,r.jsx)("button",{className:"p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors",children:(0,r.jsx)(x,{className:"w-5 h-5 text-gray-600"})}),(0,r.jsx)("select",{className:"px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-700 font-medium cursor-pointer",value:w,onChange:e=>v(e.target.value),children:f.map(e=>(0,r.jsx)("option",{value:e,children:e},e))})]})]}),(0,r.jsx)("div",{className:"flex gap-2 flex-wrap mt-4",children:f.slice(0,6).map(e=>(0,r.jsx)("button",{onClick:()=>v(e),className:`px-4 py-2 rounded-full text-sm font-medium transition-all ${w===e?"bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25":"bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"}`,children:e},e))})]}),(0,r.jsxs)("div",{className:"flex items-center justify-between",children:[(0,r.jsxs)("p",{className:"text-gray-600",children:[(0,r.jsx)("span",{className:"font-semibold text-gray-900",children:j.length})," ",1===j.length?"médico encontrado":"médicos encontrados"]}),(0,r.jsxs)("div",{className:"flex items-center gap-2 text-sm text-gray-500",children:[(0,r.jsx)("span",{children:"Ordenar por:"}),(0,r.jsxs)("select",{className:"bg-transparent font-medium text-gray-700 cursor-pointer",children:[(0,r.jsx)("option",{children:"Relevancia"}),(0,r.jsx)("option",{children:"Mejor calificados"}),(0,r.jsx)("option",{children:"Precio: menor a mayor"}),(0,r.jsx)("option",{children:"Disponibilidad"})]})]})]}),(0,r.jsx)("div",{className:"grid gap-4",children:j.map((e,a)=>{let t;return(0,r.jsxs)("div",{className:"group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden",children:[(0,r.jsx)("div",{className:"p-6",children:(0,r.jsxs)("div",{className:"flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6",children:[(0,r.jsxs)("div",{className:"flex items-start gap-5",children:[(0,r.jsxs)("div",{className:"relative",children:[(0,r.jsxs)("div",{className:`w-20 h-20 bg-gradient-to-br ${(t=["from-blue-500 to-blue-600","from-purple-500 to-pink-600","from-emerald-500 to-teal-600","from-orange-500 to-amber-600"])[a%t.length]} rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`,children:[e.nombre[0],e.apellido[0]]}),e.verificado&&(0,r.jsx)("div",{className:"absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg",children:(0,r.jsx)(u.Award,{className:"w-3 h-3 text-white"})})]}),(0,r.jsxs)("div",{className:"flex-1",children:[(0,r.jsxs)("div",{className:"flex items-center gap-2 flex-wrap",children:[(0,r.jsxs)("h3",{className:"text-xl font-bold text-gray-900",children:["Dr. ",e.nombre," ",e.apellido]}),e.verificado&&(0,r.jsx)("span",{className:"px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full",children:"Verificado"})]}),(0,r.jsx)("p",{className:"text-blue-600 font-semibold mt-1",children:e.especialidad}),(0,r.jsxs)("div",{className:"flex items-center gap-3 mt-3 flex-wrap",children:[(0,r.jsxs)("div",{className:"flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg",children:[(0,r.jsx)(i.Star,{className:"w-4 h-4 text-yellow-500 fill-yellow-500"}),(0,r.jsx)("span",{className:"font-bold text-gray-900",children:e.calificacion}),(0,r.jsxs)("span",{className:"text-gray-500 text-sm",children:["(",e.numReviews,")"]})]}),(0,r.jsxs)("div",{className:"flex items-center gap-1 text-gray-500 text-sm",children:[(0,r.jsx)(p,{className:"w-4 h-4"}),(0,r.jsxs)("span",{children:[e.experiencia," años exp."]})]}),e.videoConsulta&&(0,r.jsxs)("div",{className:"flex items-center gap-1 bg-purple-50 text-purple-600 px-2 py-1 rounded-lg text-sm",children:[(0,r.jsx)(d.Video,{className:"w-4 h-4"}),(0,r.jsx)("span",{className:"font-medium",children:"Video consulta"})]})]}),(0,r.jsxs)("div",{className:"flex items-center gap-2 mt-3 text-sm",children:[(0,r.jsx)("span",{className:"w-2 h-2 bg-emerald-500 rounded-full animate-pulse"}),(0,r.jsx)(o.Clock,{className:"w-4 h-4 text-gray-400"}),(0,r.jsxs)("span",{className:"text-gray-600",children:["Próxima disponibilidad: ",(0,r.jsx)("span",{className:"font-medium text-emerald-600",children:e.proximaDisponibilidad})]})]})]})]}),(0,r.jsxs)("div",{className:"flex flex-col items-end gap-3 lg:min-w-[180px]",children:[(0,r.jsxs)("div",{className:"text-right",children:[(0,r.jsxs)("p",{className:"text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",children:["$",e.precio]}),(0,r.jsx)("p",{className:"text-sm text-gray-500",children:"por consulta"})]}),(0,r.jsxs)("div",{className:"flex gap-2",children:[(0,r.jsx)("button",{className:"p-2.5 border-2 border-gray-200 rounded-xl hover:border-red-200 hover:bg-red-50 transition-colors group",children:(0,r.jsx)(h.Heart,{className:"w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors"})}),(0,r.jsx)(s.default,{href:`/dashboard/appointments/new?doctorId=${e.id}`,children:(0,r.jsx)(g.Button,{variant:"gradient",className:"shadow-lg shadow-blue-500/25",rightIcon:(0,r.jsx)(c,{className:"w-4 h-4"}),children:"Agendar Cita"})})]})]})]})}),(0,r.jsx)("div",{className:"h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"})]},e.id)})}),0===j.length&&(0,r.jsxs)("div",{className:"bg-white rounded-2xl shadow-sm border border-gray-100 py-16 text-center",children:[(0,r.jsx)("div",{className:"w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4",children:(0,r.jsx)(l.Search,{className:"w-10 h-10 text-gray-400"})}),(0,r.jsx)("h3",{className:"text-xl font-semibold text-gray-900",children:"No se encontraron médicos"}),(0,r.jsx)("p",{className:"text-gray-500 mt-2 max-w-sm mx-auto",children:"Intenta con otros términos de búsqueda o cambia los filtros seleccionados"}),(0,r.jsx)(g.Button,{variant:"outline",className:"mt-6",onClick:()=>{y(""),v("Todas")},children:"Limpiar filtros"})]})]})}e.s(["default",()=>y],48152)}]);