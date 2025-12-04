(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,41986,e=>{"use strict";let r=(0,e.i(79191).default)("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);e.s(["CheckCircle",()=>r],41986)},21906,11441,e=>{"use strict";var r=e.i(98781),t=e.i(78271);let a=(0,e.i(79191).default)("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]),s=(0,t.forwardRef)(({children:e,className:t="",variant:s="primary",size:l="md",isLoading:i=!1,leftIcon:n,rightIcon:o,glow:c=!1,disabled:d,...u},x)=>{let h=`
      inline-flex items-center justify-center font-semibold rounded-2xl
      transition-all duration-300 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      active:scale-[0.98]
    `,b={primary:`
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
      `};return(0,r.jsxs)("button",{ref:x,className:`${h} ${b[s]} ${{sm:"px-4 py-2 text-sm gap-1.5",md:"px-6 py-3 text-sm gap-2",lg:"px-8 py-3.5 text-base gap-2",xl:"px-10 py-4 text-lg gap-2.5"}[l]} ${c?"animate-pulse-glow":""} ${t}`,disabled:d||i,...u,children:[i?(0,r.jsx)(a,{className:"w-5 h-5 animate-spin"}):n?(0,r.jsx)("span",{className:"flex-shrink-0",children:n}):null,e,o&&!i&&(0,r.jsx)("span",{className:"flex-shrink-0",children:o})]})});s.displayName="Button",e.s(["default",0,s],21906);let l=(0,t.forwardRef)(({label:e,error:t,helperText:a,leftIcon:s,rightIcon:l,variant:i="default",className:n="",id:o,...c},d)=>{let u=o||c.name,x={default:`
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
      `};return(0,r.jsxs)("div",{className:"w-full",children:[e&&(0,r.jsx)("label",{htmlFor:u,className:`block text-sm font-semibold mb-2 ${"glass"===i?"text-white/90":"text-gray-700"}`,children:e}),(0,r.jsxs)("div",{className:"relative group",children:[s&&(0,r.jsx)("div",{className:`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${"glass"===i?"text-white/60 group-focus-within:text-white":"text-gray-400 group-focus-within:text-blue-500"}`,children:s}),(0,r.jsx)("input",{ref:d,id:u,className:`
              block w-full rounded-2xl
              transition-all duration-300 ease-out
              ${s?"pl-12":"pl-4"}
              ${l?"pr-12":"pr-4"}
              py-3.5
              ${x[i]}
              ${t&&"default"===i?"!border-red-300 focus:!border-red-500 focus:!ring-red-500/10":""}
              focus:outline-none
              ${"glass"===i?"":"placeholder:text-gray-400"}
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${n}
            `,"aria-invalid":!!t,...c}),l&&(0,r.jsx)("div",{className:`absolute inset-y-0 right-0 pr-4 flex items-center ${"glass"===i?"text-white/60":"text-gray-400"}`,children:l})]}),t&&(0,r.jsxs)("p",{className:"mt-2 text-sm text-red-500 flex items-center gap-1.5",children:[(0,r.jsx)("svg",{className:"w-4 h-4",fill:"currentColor",viewBox:"0 0 20 20",children:(0,r.jsx)("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",clipRule:"evenodd"})}),t]}),a&&!t&&(0,r.jsx)("p",{className:`mt-2 text-sm ${"glass"===i?"text-white/70":"text-gray-500"}`,children:a})]})});l.displayName="Input",e.s(["default",0,l],11441)},66173,e=>{"use strict";let r=(0,e.i(79191).default)("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);e.s(["AlertCircle",()=>r],66173)},9649,e=>{"use strict";let r=(0,e.i(79191).default)("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);e.s(["Info",()=>r],9649)},13950,e=>{"use strict";let r=(0,e.i(79191).default)("CircleX",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);e.s(["XCircle",()=>r],13950)},69337,99160,11523,41460,e=>{"use strict";e.i(21906),e.i(11441);var r=e.i(98781),t=e.i(66173),a=e.i(41986),s=e.i(9649),l=e.i(13950),i=e.i(91481);function n({children:e,variant:n="info",title:o,onClose:c,className:d=""}){let{bg:u,border:x,text:h,icon:b}={info:{bg:"bg-blue-50",border:"border-blue-200",text:"text-blue-800",icon:(0,r.jsx)(s.Info,{className:"w-5 h-5 text-blue-500"})},success:{bg:"bg-green-50",border:"border-green-200",text:"text-green-800",icon:(0,r.jsx)(a.CheckCircle,{className:"w-5 h-5 text-green-500"})},warning:{bg:"bg-yellow-50",border:"border-yellow-200",text:"text-yellow-800",icon:(0,r.jsx)(t.AlertCircle,{className:"w-5 h-5 text-yellow-500"})},error:{bg:"bg-red-50",border:"border-red-200",text:"text-red-800",icon:(0,r.jsx)(l.XCircle,{className:"w-5 h-5 text-red-500"})}}[n];return(0,r.jsx)("div",{className:`${u} ${x} ${h} border rounded-lg p-4 ${d}`,role:"alert",children:(0,r.jsxs)("div",{className:"flex",children:[(0,r.jsx)("div",{className:"flex-shrink-0",children:b}),(0,r.jsxs)("div",{className:"ml-3 flex-1",children:[o&&(0,r.jsx)("h3",{className:"font-medium",children:o}),(0,r.jsx)("div",{className:o?"mt-1 text-sm":"text-sm",children:e})]}),c&&(0,r.jsx)("button",{onClick:c,className:"flex-shrink-0 ml-4 inline-flex text-current hover:opacity-75",children:(0,r.jsx)(i.X,{className:"w-5 h-5"})})]})})}function o({children:e,className:t="",variant:a="default",size:s="md",hover:l=!0,glow:i=!1,glowColor:n="blue",blur:o="md",icon:c,iconBg:d="gradient-primary",...u}){let x={default:`
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
        ${x[a]}
        ${{sm:"p-4 rounded-xl",md:"p-6 rounded-2xl",lg:"p-8 rounded-3xl",xl:"p-10 rounded-3xl"}[s]}
        ${{sm:"backdrop-blur-sm",md:"backdrop-blur-xl",lg:"backdrop-blur-2xl"}[o]}
        ${i?({blue:"shadow-[0_0_30px_rgba(46,108,253,0.3)]",green:"shadow-[0_0_30px_rgba(34,197,94,0.3)]",purple:"shadow-[0_0_30px_rgba(185,162,232,0.3)]"})[n]:""}
        ${l?"hover:-translate-y-2 hover:shadow-[0_20px_50px_0_rgba(0,0,0,0.15)]":""}
        transition-all duration-300
        ${t}
      `,...u,children:[c&&(0,r.jsx)("div",{className:`
          w-14 h-14 rounded-2xl ${d} 
          flex items-center justify-center mb-4
          shadow-lg
        `,children:c}),e]})}function c({children:e,className:t="",padding:a="md",hover:s=!1,gradient:l=!1}){return(0,r.jsx)("div",{className:`
        bg-white rounded-2xl border border-gray-100 
        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.05)]
        ${s?"transition-all duration-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] hover:border-gray-200 hover:-translate-y-1":""}
        ${l?"bg-gradient-to-br from-white to-gray-50/50":""}
        ${{none:"",sm:"p-4",md:"p-6",lg:"p-8"}[a]} 
        ${t}
      `,children:e})}function d({children:e,className:t=""}){return(0,r.jsx)("div",{className:`border-b border-gray-100 pb-5 mb-5 ${t}`,children:e})}function u({children:e,className:t=""}){return(0,r.jsx)("h3",{className:`text-xl font-bold text-gray-900 ${t}`,children:e})}function x({children:e,className:t=""}){return(0,r.jsx)("p",{className:`text-sm text-gray-500 mt-1.5 ${t}`,children:e})}function h({children:e,className:t=""}){return(0,r.jsx)("div",{className:t,children:e})}e.s(["default",()=>n],99160),e.s(["default",()=>o],11523),e.s(["Card",()=>c,"CardContent",()=>h,"CardDescription",()=>x,"CardHeader",()=>d,"CardTitle",()=>u],41460),e.s([],69337)},46853,e=>{"use strict";var r=e.i(21906);e.s(["Button",()=>r.default])},99634,e=>{"use strict";let r=(0,e.i(79191).default)("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);e.s(["Shield",()=>r],99634)},30063,37111,15295,e=>{"use strict";var r=e.i(79191);let t=(0,r.default)("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);e.s(["Lock",()=>t],30063);let a=(0,r.default)("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Eye",()=>a],37111);let s=(0,r.default)("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);e.s(["EyeOff",()=>s],15295)},97355,e=>{"use strict";var r=e.i(98781),t=e.i(78271),a=e.i(91400),s=e.i(87957),l=e.i(36273),i=e.i(30063),n=e.i(37111),o=e.i(15295),c=e.i(86024),d=e.i(99634),u=e.i(5020);e.i(69337);var x=e.i(46853),h=e.i(56596),b=e.i(30248),m=e.i(41460),p=e.i(71309);let f=l.z.object({currentPassword:l.z.string().min(1,"La contraseña actual es requerida"),newPassword:l.z.string().min(8,"La contraseña debe tener al menos 8 caracteres").regex(/[A-Z]/,"Debe contener al menos una mayúscula").regex(/[a-z]/,"Debe contener al menos una minúscula").regex(/[0-9]/,"Debe contener al menos un número"),confirmPassword:l.z.string()}).refine(e=>e.newPassword===e.confirmPassword,{message:"Las contraseñas no coinciden",path:["confirmPassword"]});function g(){let{user:e}=(0,u.useAuthStore)(),[l,g]=(0,t.useState)(!1),[y,w]=(0,t.useState)(!1),[j,v]=(0,t.useState)(null),[N,k]=(0,t.useState)({current:!1,new:!1,confirm:!1}),[_,C]=(0,t.useState)({email:!0,push:!0,appointments:!0,marketing:!1}),{register:$,handleSubmit:P,reset:z,formState:{errors:E}}=(0,a.useForm)({resolver:(0,s.zodResolver)(f)}),A=async e=>{g(!0),v(null),w(!1);try{await (0,p.changePassword)(e.currentPassword,e.newPassword),w(!0),z()}catch(e){v(e.response?.data?.message||"Error al cambiar la contraseña")}finally{g(!1)}};return(0,r.jsxs)("div",{className:"max-w-2xl mx-auto space-y-6",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("h1",{className:"text-2xl font-bold text-gray-900",children:"Configuración"}),(0,r.jsx)("p",{className:"text-gray-600 mt-1",children:"Gestiona tus preferencias y seguridad"})]}),(0,r.jsxs)(m.Card,{children:[(0,r.jsxs)(m.CardHeader,{children:[(0,r.jsxs)("div",{className:"flex items-center",children:[(0,r.jsx)(d.Shield,{className:"w-5 h-5 text-blue-600 mr-2"}),(0,r.jsx)(m.CardTitle,{children:"Cambiar Contraseña"})]}),(0,r.jsx)(m.CardDescription,{children:"Asegúrate de usar una contraseña segura"})]}),(0,r.jsxs)(m.CardContent,{children:[y&&(0,r.jsx)(b.Alert,{variant:"success",onClose:()=>w(!1),className:"mb-4",children:"Contraseña actualizada correctamente"}),j&&(0,r.jsx)(b.Alert,{variant:"error",onClose:()=>v(null),className:"mb-4",children:j}),(0,r.jsxs)("form",{onSubmit:P(A),className:"space-y-4",children:[(0,r.jsx)(h.Input,{label:"Contraseña Actual",type:N.current?"text":"password",placeholder:"••••••••",leftIcon:(0,r.jsx)(i.Lock,{className:"w-5 h-5"}),rightIcon:(0,r.jsx)("button",{type:"button",onClick:()=>k({...N,current:!N.current}),className:"focus:outline-none",children:N.current?(0,r.jsx)(o.EyeOff,{className:"w-5 h-5"}):(0,r.jsx)(n.Eye,{className:"w-5 h-5"})}),error:E.currentPassword?.message,...$("currentPassword")}),(0,r.jsx)(h.Input,{label:"Nueva Contraseña",type:N.new?"text":"password",placeholder:"••••••••",leftIcon:(0,r.jsx)(i.Lock,{className:"w-5 h-5"}),rightIcon:(0,r.jsx)("button",{type:"button",onClick:()=>k({...N,new:!N.new}),className:"focus:outline-none",children:N.new?(0,r.jsx)(o.EyeOff,{className:"w-5 h-5"}):(0,r.jsx)(n.Eye,{className:"w-5 h-5"})}),error:E.newPassword?.message,helperText:"Mínimo 8 caracteres, una mayúscula, una minúscula y un número",...$("newPassword")}),(0,r.jsx)(h.Input,{label:"Confirmar Nueva Contraseña",type:N.confirm?"text":"password",placeholder:"••••••••",leftIcon:(0,r.jsx)(i.Lock,{className:"w-5 h-5"}),rightIcon:(0,r.jsx)("button",{type:"button",onClick:()=>k({...N,confirm:!N.confirm}),className:"focus:outline-none",children:N.confirm?(0,r.jsx)(o.EyeOff,{className:"w-5 h-5"}):(0,r.jsx)(n.Eye,{className:"w-5 h-5"})}),error:E.confirmPassword?.message,...$("confirmPassword")}),(0,r.jsx)("div",{className:"flex justify-end",children:(0,r.jsx)(x.Button,{type:"submit",isLoading:l,children:"Cambiar Contraseña"})})]})]})]}),(0,r.jsxs)(m.Card,{children:[(0,r.jsxs)(m.CardHeader,{children:[(0,r.jsxs)("div",{className:"flex items-center",children:[(0,r.jsx)(c.Bell,{className:"w-5 h-5 text-blue-600 mr-2"}),(0,r.jsx)(m.CardTitle,{children:"Notificaciones"})]}),(0,r.jsx)(m.CardDescription,{children:"Configura cómo quieres recibir notificaciones"})]}),(0,r.jsx)(m.CardContent,{children:(0,r.jsx)("div",{className:"space-y-4",children:[{key:"email",label:"Notificaciones por Email",description:"Recibe actualizaciones importantes por correo"},{key:"push",label:"Notificaciones Push",description:"Recibe notificaciones en tiempo real"},{key:"appointments",label:"Recordatorios de Citas",description:"Recibe recordatorios antes de tus citas"},{key:"marketing",label:"Comunicaciones de Marketing",description:"Recibe ofertas y novedades"}].map(e=>(0,r.jsxs)("div",{className:"flex items-center justify-between py-3 border-b last:border-0",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("p",{className:"font-medium text-gray-900",children:e.label}),(0,r.jsx)("p",{className:"text-sm text-gray-500",children:e.description})]}),(0,r.jsxs)("label",{className:"relative inline-flex items-center cursor-pointer",children:[(0,r.jsx)("input",{type:"checkbox",checked:_[e.key],onChange:r=>C({..._,[e.key]:r.target.checked}),className:"sr-only peer"}),(0,r.jsx)("div",{className:"w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"})]})]},e.key))})})]}),(0,r.jsxs)(m.Card,{className:"border-red-200",children:[(0,r.jsxs)(m.CardHeader,{children:[(0,r.jsx)(m.CardTitle,{className:"text-red-600",children:"Zona de Peligro"}),(0,r.jsx)(m.CardDescription,{children:"Acciones irreversibles para tu cuenta"})]}),(0,r.jsx)(m.CardContent,{children:(0,r.jsxs)("div",{className:"flex items-center justify-between",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("p",{className:"font-medium text-gray-900",children:"Eliminar Cuenta"}),(0,r.jsx)("p",{className:"text-sm text-gray-500",children:"Esta acción es permanente y no se puede deshacer"})]}),(0,r.jsx)(x.Button,{variant:"danger",children:"Eliminar Cuenta"})]})})]})]})}e.s(["default",()=>g])}]);