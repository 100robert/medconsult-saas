(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,41986,e=>{"use strict";let r=(0,e.i(79191).default)("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);e.s(["CheckCircle",()=>r],41986)},21906,11441,e=>{"use strict";var r=e.i(98781),t=e.i(78271);let l=(0,e.i(79191).default)("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]),a=(0,t.forwardRef)(({children:e,className:t="",variant:a="primary",size:s="md",isLoading:i=!1,leftIcon:o,rightIcon:n,glow:d=!1,disabled:c,...x},u)=>{let h=`
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
      `};return(0,r.jsxs)("button",{ref:u,className:`${h} ${b[a]} ${{sm:"px-4 py-2 text-sm gap-1.5",md:"px-6 py-3 text-sm gap-2",lg:"px-8 py-3.5 text-base gap-2",xl:"px-10 py-4 text-lg gap-2.5"}[s]} ${d?"animate-pulse-glow":""} ${t}`,disabled:c||i,...x,children:[i?(0,r.jsx)(l,{className:"w-5 h-5 animate-spin"}):o?(0,r.jsx)("span",{className:"flex-shrink-0",children:o}):null,e,n&&!i&&(0,r.jsx)("span",{className:"flex-shrink-0",children:n})]})});a.displayName="Button",e.s(["default",0,a],21906);let s=(0,t.forwardRef)(({label:e,error:t,helperText:l,leftIcon:a,rightIcon:s,variant:i="default",className:o="",id:n,...d},c)=>{let x=n||d.name,u={default:`
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
      `};return(0,r.jsxs)("div",{className:"w-full",children:[e&&(0,r.jsx)("label",{htmlFor:x,className:`block text-sm font-semibold mb-2 ${"glass"===i?"text-white/90":"text-gray-700"}`,children:e}),(0,r.jsxs)("div",{className:"relative group",children:[a&&(0,r.jsx)("div",{className:`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${"glass"===i?"text-white/60 group-focus-within:text-white":"text-gray-400 group-focus-within:text-blue-500"}`,children:a}),(0,r.jsx)("input",{ref:c,id:x,className:`
              block w-full rounded-2xl
              transition-all duration-300 ease-out
              ${a?"pl-12":"pl-4"}
              ${s?"pr-12":"pr-4"}
              py-3.5
              ${u[i]}
              ${t&&"default"===i?"!border-red-300 focus:!border-red-500 focus:!ring-red-500/10":""}
              focus:outline-none
              ${"glass"===i?"":"placeholder:text-gray-400"}
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${o}
            `,"aria-invalid":!!t,...d}),s&&(0,r.jsx)("div",{className:`absolute inset-y-0 right-0 pr-4 flex items-center ${"glass"===i?"text-white/60":"text-gray-400"}`,children:s})]}),t&&(0,r.jsxs)("p",{className:"mt-2 text-sm text-red-500 flex items-center gap-1.5",children:[(0,r.jsx)("svg",{className:"w-4 h-4",fill:"currentColor",viewBox:"0 0 20 20",children:(0,r.jsx)("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",clipRule:"evenodd"})}),t]}),l&&!t&&(0,r.jsx)("p",{className:`mt-2 text-sm ${"glass"===i?"text-white/70":"text-gray-500"}`,children:l})]})});s.displayName="Input",e.s(["default",0,s],11441)},66173,e=>{"use strict";let r=(0,e.i(79191).default)("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);e.s(["AlertCircle",()=>r],66173)},9649,e=>{"use strict";let r=(0,e.i(79191).default)("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);e.s(["Info",()=>r],9649)},13950,e=>{"use strict";let r=(0,e.i(79191).default)("CircleX",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);e.s(["XCircle",()=>r],13950)},69337,99160,11523,41460,e=>{"use strict";e.i(21906),e.i(11441);var r=e.i(98781),t=e.i(66173),l=e.i(41986),a=e.i(9649),s=e.i(13950),i=e.i(91481);function o({children:e,variant:o="info",title:n,onClose:d,className:c=""}){let{bg:x,border:u,text:h,icon:b}={info:{bg:"bg-blue-50",border:"border-blue-200",text:"text-blue-800",icon:(0,r.jsx)(a.Info,{className:"w-5 h-5 text-blue-500"})},success:{bg:"bg-green-50",border:"border-green-200",text:"text-green-800",icon:(0,r.jsx)(l.CheckCircle,{className:"w-5 h-5 text-green-500"})},warning:{bg:"bg-yellow-50",border:"border-yellow-200",text:"text-yellow-800",icon:(0,r.jsx)(t.AlertCircle,{className:"w-5 h-5 text-yellow-500"})},error:{bg:"bg-red-50",border:"border-red-200",text:"text-red-800",icon:(0,r.jsx)(s.XCircle,{className:"w-5 h-5 text-red-500"})}}[o];return(0,r.jsx)("div",{className:`${x} ${u} ${h} border rounded-lg p-4 ${c}`,role:"alert",children:(0,r.jsxs)("div",{className:"flex",children:[(0,r.jsx)("div",{className:"flex-shrink-0",children:b}),(0,r.jsxs)("div",{className:"ml-3 flex-1",children:[n&&(0,r.jsx)("h3",{className:"font-medium",children:n}),(0,r.jsx)("div",{className:n?"mt-1 text-sm":"text-sm",children:e})]}),d&&(0,r.jsx)("button",{onClick:d,className:"flex-shrink-0 ml-4 inline-flex text-current hover:opacity-75",children:(0,r.jsx)(i.X,{className:"w-5 h-5"})})]})})}function n({children:e,className:t="",variant:l="default",size:a="md",hover:s=!0,glow:i=!1,glowColor:o="blue",blur:n="md",icon:d,iconBg:c="gradient-primary",...x}){let u={default:`
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
        ${u[l]}
        ${{sm:"p-4 rounded-xl",md:"p-6 rounded-2xl",lg:"p-8 rounded-3xl",xl:"p-10 rounded-3xl"}[a]}
        ${{sm:"backdrop-blur-sm",md:"backdrop-blur-xl",lg:"backdrop-blur-2xl"}[n]}
        ${i?({blue:"shadow-[0_0_30px_rgba(46,108,253,0.3)]",green:"shadow-[0_0_30px_rgba(34,197,94,0.3)]",purple:"shadow-[0_0_30px_rgba(185,162,232,0.3)]"})[o]:""}
        ${s?"hover:-translate-y-2 hover:shadow-[0_20px_50px_0_rgba(0,0,0,0.15)]":""}
        transition-all duration-300
        ${t}
      `,...x,children:[d&&(0,r.jsx)("div",{className:`
          w-14 h-14 rounded-2xl ${c} 
          flex items-center justify-center mb-4
          shadow-lg
        `,children:d}),e]})}function d({children:e,className:t="",padding:l="md",hover:a=!1,gradient:s=!1}){return(0,r.jsx)("div",{className:`
        bg-white rounded-2xl border border-gray-100 
        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.05)]
        ${a?"transition-all duration-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] hover:border-gray-200 hover:-translate-y-1":""}
        ${s?"bg-gradient-to-br from-white to-gray-50/50":""}
        ${{none:"",sm:"p-4",md:"p-6",lg:"p-8"}[l]} 
        ${t}
      `,children:e})}function c({children:e,className:t=""}){return(0,r.jsx)("div",{className:`border-b border-gray-100 pb-5 mb-5 ${t}`,children:e})}function x({children:e,className:t=""}){return(0,r.jsx)("h3",{className:`text-xl font-bold text-gray-900 ${t}`,children:e})}function u({children:e,className:t=""}){return(0,r.jsx)("p",{className:`text-sm text-gray-500 mt-1.5 ${t}`,children:e})}function h({children:e,className:t=""}){return(0,r.jsx)("div",{className:t,children:e})}e.s(["default",()=>o],99160),e.s(["default",()=>n],11523),e.s(["Card",()=>d,"CardContent",()=>h,"CardDescription",()=>u,"CardHeader",()=>c,"CardTitle",()=>x],41460),e.s([],69337)},46853,e=>{"use strict";var r=e.i(21906);e.s(["Button",()=>r.default])},98711,e=>{"use strict";let r=(0,e.i(79191).default)("MapPin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);e.s(["MapPin",()=>r],98711)},73886,e=>{"use strict";let r=(0,e.i(79191).default)("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);e.s(["Mail",()=>r],73886)},19446,e=>{"use strict";let r=(0,e.i(79191).default)("Phone",[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);e.s(["Phone",()=>r],19446)},31707,e=>{"use strict";var r=e.i(98781),t=e.i(78271),l=e.i(91400),a=e.i(87957),s=e.i(36273),i=e.i(47303),o=e.i(73886),n=e.i(19446),d=e.i(5097),c=e.i(98711);let x=(0,e.i(79191).default)("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]);var u=e.i(5020);e.i(69337);var h=e.i(46853),b=e.i(56596),m=e.i(30248),g=e.i(41460),p=e.i(71309);let f=s.z.object({nombre:s.z.string().min(2,"El nombre debe tener al menos 2 caracteres"),apellido:s.z.string().min(2,"El apellido debe tener al menos 2 caracteres"),telefono:s.z.string().optional(),fechaNacimiento:s.z.string().optional(),genero:s.z.enum(["MASCULINO","FEMENINO","OTRO",""]).optional(),direccion:s.z.string().optional()});function y(){let{user:e,setUser:s}=(0,u.useAuthStore)(),[y,w]=(0,t.useState)(!1),[j,v]=(0,t.useState)(!1),[N,_]=(0,t.useState)(null),{register:k,handleSubmit:C,formState:{errors:$}}=(0,l.useForm)({resolver:(0,a.zodResolver)(f),defaultValues:{nombre:e?.nombre||"",apellido:e?.apellido||"",telefono:e?.telefono||"",fechaNacimiento:e?.fechaNacimiento?.split("T")[0]||"",genero:e?.genero||"",direccion:e?.direccion||""}}),z=async e=>{w(!0),_(null),v(!1);try{let r=await (0,p.updateProfile)({...e,genero:e.genero||void 0});s(r),v(!0)}catch(e){_(e.response?.data?.message||"Error al actualizar el perfil")}finally{w(!1)}};return(0,r.jsxs)("div",{className:"max-w-2xl mx-auto space-y-6",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("h1",{className:"text-2xl font-bold text-gray-900",children:"Mi Perfil"}),(0,r.jsx)("p",{className:"text-gray-600 mt-1",children:"Gestiona tu información personal"})]}),(0,r.jsx)(g.Card,{children:(0,r.jsx)(g.CardContent,{className:"pt-6",children:(0,r.jsxs)("div",{className:"flex items-center",children:[(0,r.jsxs)("div",{className:"relative",children:[(0,r.jsx)("div",{className:"w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center",children:e?.avatar?(0,r.jsx)("img",{src:e.avatar,alt:"Avatar",className:"w-20 h-20 rounded-full object-cover"}):(0,r.jsx)(i.User,{className:"w-10 h-10 text-blue-600"})}),(0,r.jsx)("button",{className:"absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700",children:(0,r.jsx)(x,{className:"w-4 h-4"})})]}),(0,r.jsxs)("div",{className:"ml-6",children:[(0,r.jsxs)("h2",{className:"text-xl font-semibold text-gray-900",children:[e?.nombre," ",e?.apellido]}),(0,r.jsx)("p",{className:"text-gray-500",children:e?.email}),(0,r.jsx)("span",{className:"inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full",children:e?.rol})]})]})})}),(0,r.jsxs)(g.Card,{children:[(0,r.jsxs)(g.CardHeader,{children:[(0,r.jsx)(g.CardTitle,{children:"Información Personal"}),(0,r.jsx)(g.CardDescription,{children:"Actualiza tu información de perfil"})]}),(0,r.jsxs)(g.CardContent,{children:[j&&(0,r.jsx)(m.Alert,{variant:"success",onClose:()=>v(!1),className:"mb-4",children:"Perfil actualizado correctamente"}),N&&(0,r.jsx)(m.Alert,{variant:"error",onClose:()=>_(null),className:"mb-4",children:N}),(0,r.jsxs)("form",{onSubmit:C(z),className:"space-y-4",children:[(0,r.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,r.jsx)(b.Input,{label:"Nombre",placeholder:"Juan",leftIcon:(0,r.jsx)(i.User,{className:"w-5 h-5"}),error:$.nombre?.message,...k("nombre")}),(0,r.jsx)(b.Input,{label:"Apellido",placeholder:"Pérez",error:$.apellido?.message,...k("apellido")})]}),(0,r.jsx)(b.Input,{label:"Email",type:"email",value:e?.email,disabled:!0,leftIcon:(0,r.jsx)(o.Mail,{className:"w-5 h-5"}),helperText:"El email no puede ser modificado"}),(0,r.jsx)(b.Input,{label:"Teléfono",type:"tel",placeholder:"+1 234 567 8900",leftIcon:(0,r.jsx)(n.Phone,{className:"w-5 h-5"}),error:$.telefono?.message,...k("telefono")}),(0,r.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,r.jsx)(b.Input,{label:"Fecha de Nacimiento",type:"date",leftIcon:(0,r.jsx)(d.Calendar,{className:"w-5 h-5"}),error:$.fechaNacimiento?.message,...k("fechaNacimiento")}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Género"}),(0,r.jsxs)("select",{className:"block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",...k("genero"),children:[(0,r.jsx)("option",{value:"",children:"Seleccionar"}),(0,r.jsx)("option",{value:"MASCULINO",children:"Masculino"}),(0,r.jsx)("option",{value:"FEMENINO",children:"Femenino"}),(0,r.jsx)("option",{value:"OTRO",children:"Otro"})]})]})]}),(0,r.jsx)(b.Input,{label:"Dirección",placeholder:"Calle 123, Ciudad",leftIcon:(0,r.jsx)(c.MapPin,{className:"w-5 h-5"}),error:$.direccion?.message,...k("direccion")}),(0,r.jsx)("div",{className:"flex justify-end",children:(0,r.jsx)(h.Button,{type:"submit",isLoading:y,children:"Guardar Cambios"})})]})]})]})]})}e.s(["default",()=>y],31707)}]);