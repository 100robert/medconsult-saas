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
      `,children:a})}function k({children:a,className:c=""}){return(0,b.jsx)("div",{className:`border-b border-gray-100 pb-5 mb-5 ${c}`,children:a})}function l({children:a,className:c=""}){return(0,b.jsx)("h3",{className:`text-xl font-bold text-gray-900 ${c}`,children:a})}function m({children:a,className:c=""}){return(0,b.jsx)("p",{className:`text-sm text-gray-500 mt-1.5 ${c}`,children:a})}function n({children:a,className:c=""}){return(0,b.jsx)("div",{className:c,children:a})}a.s(["default",()=>h],61501),a.s(["default",()=>i],1513),a.s(["Card",()=>j,"CardContent",()=>n,"CardDescription",()=>m,"CardHeader",()=>k,"CardTitle",()=>l],92631),a.s([],7277)},58468,a=>{"use strict";var b=a.i(73043);a.s(["Button",()=>b.default])},89410,a=>{"use strict";let b=(0,a.i(47904).default)("MapPin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);a.s(["MapPin",()=>b],89410)},35649,a=>{"use strict";let b=(0,a.i(47904).default)("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);a.s(["Mail",()=>b],35649)},57495,a=>{"use strict";let b=(0,a.i(47904).default)("Phone",[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);a.s(["Phone",()=>b],57495)},18705,a=>{"use strict";var b=a.i(32445),c=a.i(56491),d=a.i(72243),e=a.i(23136),f=a.i(7346),g=a.i(45953),h=a.i(35649),i=a.i(57495),j=a.i(21158),k=a.i(89410);let l=(0,a.i(47904).default)("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]);var m=a.i(52461);a.i(7277);var n=a.i(58468),o=a.i(86875),p=a.i(15991),q=a.i(92631),r=a.i(95480);let s=f.z.object({nombre:f.z.string().min(2,"El nombre debe tener al menos 2 caracteres"),apellido:f.z.string().min(2,"El apellido debe tener al menos 2 caracteres"),telefono:f.z.string().optional(),fechaNacimiento:f.z.string().optional(),genero:f.z.enum(["MASCULINO","FEMENINO","OTRO",""]).optional(),direccion:f.z.string().optional()});function t(){let{user:a,setUser:f}=(0,m.useAuthStore)(),[t,u]=(0,c.useState)(!1),[v,w]=(0,c.useState)(!1),[x,y]=(0,c.useState)(null),{register:z,handleSubmit:A,formState:{errors:B}}=(0,d.useForm)({resolver:(0,e.zodResolver)(s),defaultValues:{nombre:a?.nombre||"",apellido:a?.apellido||"",telefono:a?.telefono||"",fechaNacimiento:a?.fechaNacimiento?.split("T")[0]||"",genero:a?.genero||"",direccion:a?.direccion||""}}),C=async a=>{u(!0),y(null),w(!1);try{let b=await (0,r.updateProfile)({...a,genero:a.genero||void 0});f(b),w(!0)}catch(a){y(a.response?.data?.message||"Error al actualizar el perfil")}finally{u(!1)}};return(0,b.jsxs)("div",{className:"max-w-2xl mx-auto space-y-6",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-2xl font-bold text-gray-900",children:"Mi Perfil"}),(0,b.jsx)("p",{className:"text-gray-600 mt-1",children:"Gestiona tu información personal"})]}),(0,b.jsx)(q.Card,{children:(0,b.jsx)(q.CardContent,{className:"pt-6",children:(0,b.jsxs)("div",{className:"flex items-center",children:[(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsx)("div",{className:"w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center",children:a?.avatar?(0,b.jsx)("img",{src:a.avatar,alt:"Avatar",className:"w-20 h-20 rounded-full object-cover"}):(0,b.jsx)(g.User,{className:"w-10 h-10 text-blue-600"})}),(0,b.jsx)("button",{className:"absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700",children:(0,b.jsx)(l,{className:"w-4 h-4"})})]}),(0,b.jsxs)("div",{className:"ml-6",children:[(0,b.jsxs)("h2",{className:"text-xl font-semibold text-gray-900",children:[a?.nombre," ",a?.apellido]}),(0,b.jsx)("p",{className:"text-gray-500",children:a?.email}),(0,b.jsx)("span",{className:"inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full",children:a?.rol})]})]})})}),(0,b.jsxs)(q.Card,{children:[(0,b.jsxs)(q.CardHeader,{children:[(0,b.jsx)(q.CardTitle,{children:"Información Personal"}),(0,b.jsx)(q.CardDescription,{children:"Actualiza tu información de perfil"})]}),(0,b.jsxs)(q.CardContent,{children:[v&&(0,b.jsx)(p.Alert,{variant:"success",onClose:()=>w(!1),className:"mb-4",children:"Perfil actualizado correctamente"}),x&&(0,b.jsx)(p.Alert,{variant:"error",onClose:()=>y(null),className:"mb-4",children:x}),(0,b.jsxs)("form",{onSubmit:A(C),className:"space-y-4",children:[(0,b.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,b.jsx)(o.Input,{label:"Nombre",placeholder:"Juan",leftIcon:(0,b.jsx)(g.User,{className:"w-5 h-5"}),error:B.nombre?.message,...z("nombre")}),(0,b.jsx)(o.Input,{label:"Apellido",placeholder:"Pérez",error:B.apellido?.message,...z("apellido")})]}),(0,b.jsx)(o.Input,{label:"Email",type:"email",value:a?.email,disabled:!0,leftIcon:(0,b.jsx)(h.Mail,{className:"w-5 h-5"}),helperText:"El email no puede ser modificado"}),(0,b.jsx)(o.Input,{label:"Teléfono",type:"tel",placeholder:"+1 234 567 8900",leftIcon:(0,b.jsx)(i.Phone,{className:"w-5 h-5"}),error:B.telefono?.message,...z("telefono")}),(0,b.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,b.jsx)(o.Input,{label:"Fecha de Nacimiento",type:"date",leftIcon:(0,b.jsx)(j.Calendar,{className:"w-5 h-5"}),error:B.fechaNacimiento?.message,...z("fechaNacimiento")}),(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Género"}),(0,b.jsxs)("select",{className:"block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",...z("genero"),children:[(0,b.jsx)("option",{value:"",children:"Seleccionar"}),(0,b.jsx)("option",{value:"MASCULINO",children:"Masculino"}),(0,b.jsx)("option",{value:"FEMENINO",children:"Femenino"}),(0,b.jsx)("option",{value:"OTRO",children:"Otro"})]})]})]}),(0,b.jsx)(o.Input,{label:"Dirección",placeholder:"Calle 123, Ciudad",leftIcon:(0,b.jsx)(k.MapPin,{className:"w-5 h-5"}),error:B.direccion?.message,...z("direccion")}),(0,b.jsx)("div",{className:"flex justify-end",children:(0,b.jsx)(n.Button,{type:"submit",isLoading:t,children:"Guardar Cambios"})})]})]})]})]})}a.s(["default",()=>t],18705)}];

//# sourceMappingURL=OneDrive_Escritorio_medconsult-saas_frontend_00fc85c3._.js.map