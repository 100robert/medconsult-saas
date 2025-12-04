module.exports=[82743,a=>{"use strict";let b=(0,a.i(47904).default)("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);a.s(["CheckCircle",()=>b],82743)},73043,64780,a=>{"use strict";var b=a.i(32445),c=a.i(56491);let d=(0,a.i(47904).default)("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]),e=(0,c.forwardRef)(({children:a,className:c="",variant:e="primary",size:f="md",isLoading:g=!1,leftIcon:h,rightIcon:i,glow:j=!1,disabled:k,...l},m)=>{let n=`
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
      `,children:a})}function k({children:a,className:c=""}){return(0,b.jsx)("div",{className:`border-b border-gray-100 pb-5 mb-5 ${c}`,children:a})}function l({children:a,className:c=""}){return(0,b.jsx)("h3",{className:`text-xl font-bold text-gray-900 ${c}`,children:a})}function m({children:a,className:c=""}){return(0,b.jsx)("p",{className:`text-sm text-gray-500 mt-1.5 ${c}`,children:a})}function n({children:a,className:c=""}){return(0,b.jsx)("div",{className:c,children:a})}a.s(["default",()=>h],61501),a.s(["default",()=>i],1513),a.s(["Card",()=>j,"CardContent",()=>n,"CardDescription",()=>m,"CardHeader",()=>k,"CardTitle",()=>l],92631),a.s([],7277)},58468,a=>{"use strict";var b=a.i(73043);a.s(["Button",()=>b.default])},67759,a=>{"use strict";let b=(0,a.i(47904).default)("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);a.s(["Shield",()=>b],67759)},73803,21492,61987,a=>{"use strict";var b=a.i(47904);let c=(0,b.default)("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);a.s(["Lock",()=>c],73803);let d=(0,b.default)("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);a.s(["Eye",()=>d],21492);let e=(0,b.default)("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);a.s(["EyeOff",()=>e],61987)},21766,a=>{"use strict";var b=a.i(32445),c=a.i(56491),d=a.i(72243),e=a.i(23136),f=a.i(7346),g=a.i(73803),h=a.i(21492),i=a.i(61987),j=a.i(24018),k=a.i(67759),l=a.i(52461);a.i(7277);var m=a.i(58468),n=a.i(86875),o=a.i(15991),p=a.i(92631),q=a.i(95480);let r=f.z.object({currentPassword:f.z.string().min(1,"La contraseña actual es requerida"),newPassword:f.z.string().min(8,"La contraseña debe tener al menos 8 caracteres").regex(/[A-Z]/,"Debe contener al menos una mayúscula").regex(/[a-z]/,"Debe contener al menos una minúscula").regex(/[0-9]/,"Debe contener al menos un número"),confirmPassword:f.z.string()}).refine(a=>a.newPassword===a.confirmPassword,{message:"Las contraseñas no coinciden",path:["confirmPassword"]});function s(){let{user:a}=(0,l.useAuthStore)(),[f,s]=(0,c.useState)(!1),[t,u]=(0,c.useState)(!1),[v,w]=(0,c.useState)(null),[x,y]=(0,c.useState)({current:!1,new:!1,confirm:!1}),[z,A]=(0,c.useState)({email:!0,push:!0,appointments:!0,marketing:!1}),{register:B,handleSubmit:C,reset:D,formState:{errors:E}}=(0,d.useForm)({resolver:(0,e.zodResolver)(r)}),F=async a=>{s(!0),w(null),u(!1);try{await (0,q.changePassword)(a.currentPassword,a.newPassword),u(!0),D()}catch(a){w(a.response?.data?.message||"Error al cambiar la contraseña")}finally{s(!1)}};return(0,b.jsxs)("div",{className:"max-w-2xl mx-auto space-y-6",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-2xl font-bold text-gray-900",children:"Configuración"}),(0,b.jsx)("p",{className:"text-gray-600 mt-1",children:"Gestiona tus preferencias y seguridad"})]}),(0,b.jsxs)(p.Card,{children:[(0,b.jsxs)(p.CardHeader,{children:[(0,b.jsxs)("div",{className:"flex items-center",children:[(0,b.jsx)(k.Shield,{className:"w-5 h-5 text-blue-600 mr-2"}),(0,b.jsx)(p.CardTitle,{children:"Cambiar Contraseña"})]}),(0,b.jsx)(p.CardDescription,{children:"Asegúrate de usar una contraseña segura"})]}),(0,b.jsxs)(p.CardContent,{children:[t&&(0,b.jsx)(o.Alert,{variant:"success",onClose:()=>u(!1),className:"mb-4",children:"Contraseña actualizada correctamente"}),v&&(0,b.jsx)(o.Alert,{variant:"error",onClose:()=>w(null),className:"mb-4",children:v}),(0,b.jsxs)("form",{onSubmit:C(F),className:"space-y-4",children:[(0,b.jsx)(n.Input,{label:"Contraseña Actual",type:x.current?"text":"password",placeholder:"••••••••",leftIcon:(0,b.jsx)(g.Lock,{className:"w-5 h-5"}),rightIcon:(0,b.jsx)("button",{type:"button",onClick:()=>y({...x,current:!x.current}),className:"focus:outline-none",children:x.current?(0,b.jsx)(i.EyeOff,{className:"w-5 h-5"}):(0,b.jsx)(h.Eye,{className:"w-5 h-5"})}),error:E.currentPassword?.message,...B("currentPassword")}),(0,b.jsx)(n.Input,{label:"Nueva Contraseña",type:x.new?"text":"password",placeholder:"••••••••",leftIcon:(0,b.jsx)(g.Lock,{className:"w-5 h-5"}),rightIcon:(0,b.jsx)("button",{type:"button",onClick:()=>y({...x,new:!x.new}),className:"focus:outline-none",children:x.new?(0,b.jsx)(i.EyeOff,{className:"w-5 h-5"}):(0,b.jsx)(h.Eye,{className:"w-5 h-5"})}),error:E.newPassword?.message,helperText:"Mínimo 8 caracteres, una mayúscula, una minúscula y un número",...B("newPassword")}),(0,b.jsx)(n.Input,{label:"Confirmar Nueva Contraseña",type:x.confirm?"text":"password",placeholder:"••••••••",leftIcon:(0,b.jsx)(g.Lock,{className:"w-5 h-5"}),rightIcon:(0,b.jsx)("button",{type:"button",onClick:()=>y({...x,confirm:!x.confirm}),className:"focus:outline-none",children:x.confirm?(0,b.jsx)(i.EyeOff,{className:"w-5 h-5"}):(0,b.jsx)(h.Eye,{className:"w-5 h-5"})}),error:E.confirmPassword?.message,...B("confirmPassword")}),(0,b.jsx)("div",{className:"flex justify-end",children:(0,b.jsx)(m.Button,{type:"submit",isLoading:f,children:"Cambiar Contraseña"})})]})]})]}),(0,b.jsxs)(p.Card,{children:[(0,b.jsxs)(p.CardHeader,{children:[(0,b.jsxs)("div",{className:"flex items-center",children:[(0,b.jsx)(j.Bell,{className:"w-5 h-5 text-blue-600 mr-2"}),(0,b.jsx)(p.CardTitle,{children:"Notificaciones"})]}),(0,b.jsx)(p.CardDescription,{children:"Configura cómo quieres recibir notificaciones"})]}),(0,b.jsx)(p.CardContent,{children:(0,b.jsx)("div",{className:"space-y-4",children:[{key:"email",label:"Notificaciones por Email",description:"Recibe actualizaciones importantes por correo"},{key:"push",label:"Notificaciones Push",description:"Recibe notificaciones en tiempo real"},{key:"appointments",label:"Recordatorios de Citas",description:"Recibe recordatorios antes de tus citas"},{key:"marketing",label:"Comunicaciones de Marketing",description:"Recibe ofertas y novedades"}].map(a=>(0,b.jsxs)("div",{className:"flex items-center justify-between py-3 border-b last:border-0",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-medium text-gray-900",children:a.label}),(0,b.jsx)("p",{className:"text-sm text-gray-500",children:a.description})]}),(0,b.jsxs)("label",{className:"relative inline-flex items-center cursor-pointer",children:[(0,b.jsx)("input",{type:"checkbox",checked:z[a.key],onChange:b=>A({...z,[a.key]:b.target.checked}),className:"sr-only peer"}),(0,b.jsx)("div",{className:"w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"})]})]},a.key))})})]}),(0,b.jsxs)(p.Card,{className:"border-red-200",children:[(0,b.jsxs)(p.CardHeader,{children:[(0,b.jsx)(p.CardTitle,{className:"text-red-600",children:"Zona de Peligro"}),(0,b.jsx)(p.CardDescription,{children:"Acciones irreversibles para tu cuenta"})]}),(0,b.jsx)(p.CardContent,{children:(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-medium text-gray-900",children:"Eliminar Cuenta"}),(0,b.jsx)("p",{className:"text-sm text-gray-500",children:"Esta acción es permanente y no se puede deshacer"})]}),(0,b.jsx)(m.Button,{variant:"danger",children:"Eliminar Cuenta"})]})})]})]})}a.s(["default",()=>s])}];

//# sourceMappingURL=OneDrive_Escritorio_medconsult-saas_frontend_773ea69a._.js.map