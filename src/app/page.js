"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HeartPulse, 
  MapPin, 
  PhoneCall, 
  Navigation, 
  Mic, 
  Search, 
  Camera, 
  ChevronDown, 
  FileText, 
  UploadCloud,
  Loader2,
  CheckCircle2,
  MessageSquare,
  Settings,
  X,
  Sun,
  Moon,
  Monitor,
  Bell,
  AlertTriangle,
  HelpCircle,
  Mail,
  User,
  Tag,
  Send,
  ArrowLeft
} from "lucide-react";

// Expanded Mock Institutions with rough geographical coordinates
const mockInstitutions = [
  // Maputo (-25.9692, 32.5732)
  { id: "1", name: "Hospital Central de Maputo", type: "HOSPITAL", distance: "1.2 km", address: "Av. Agostinho Neto, 164", phone: "+258 82 123 4567", isOpen: true, province: "Maputo", lat: -25.9692, lng: 32.5732 },
  { id: "2", name: "Clínica Cruz Azul", type: "CLÍNICA", distance: "3.4 km", address: "Av. Karl Marx", phone: "+258 84 666 7788", isOpen: true, province: "Maputo", lat: -25.9650, lng: 32.5710 },
  { id: "3", name: "Farmácia Polana", type: "FARMÁCIA", distance: "0.8 km", address: "Av. Julius Nyerere", phone: "+258 84 987 6543", isOpen: false, province: "Maputo", lat: -25.9720, lng: 32.5800 },
  { id: "4", name: "Hospital Geral de Mavalane", type: "HOSPITAL", distance: "5.1 km", address: "Av. FPLM", phone: "+258 84 123 4567", isOpen: true, province: "Maputo", lat: -25.9400, lng: 32.5900 },
  { id: "5", name: "Centro de Saúde da Matola", type: "CLÍNICA", distance: "12.5 km", address: "EN4, Matola", phone: "+258 85 555 4444", isOpen: true, province: "Maputo", lat: -25.9600, lng: 32.4600 },
  { id: "16", name: "Farmácia Avenida", type: "FARMÁCIA", distance: "2.1 km", address: "Av. 24 de Julho", phone: "+258 84 100 2000", isOpen: true, province: "Maputo", lat: -25.9680, lng: 32.5780 },
  { id: "17", name: "Clínica Sommerschield", type: "CLÍNICA", distance: "4.5 km", address: "Bairro Sommerschield", phone: "+258 82 300 4000", isOpen: true, province: "Maputo", lat: -25.9550, lng: 32.5850 },
  { id: "18", name: "Hospital José Macamo", type: "HOSPITAL", distance: "6.2 km", address: "Bairro Alto Maé", phone: "+258 84 500 6000", isOpen: true, province: "Maputo", lat: -25.9520, lng: 32.5530 },
  { id: "19", name: "Farmácia Vitality", type: "FARMÁCIA", distance: "3.0 km", address: "Maputo Shopping", phone: "+258 86 700 8000", isOpen: false, province: "Maputo", lat: -25.9750, lng: 32.5710 },
  // Inhambane (-23.8650, 35.3833)
  { id: "6", name: "Hospital Provincial de Inhambane", type: "HOSPITAL", distance: "2.1 km", address: "Av. da Independência", phone: "+258 84 222 3333", isOpen: true, province: "Inhambane", lat: -23.8650, lng: 35.3833 },
  { id: "7", name: "Farmácia Boa Saúde", type: "FARMÁCIA", distance: "0.5 km", address: "Mercado Central", phone: "+258 82 444 5555", isOpen: true, province: "Inhambane", lat: -23.8660, lng: 35.3840 },
  { id: "8", name: "Clínica Tofo", type: "CLÍNICA", distance: "18.3 km", address: "Praia do Tofo", phone: "+258 86 777 8888", isOpen: false, province: "Inhambane", lat: -23.8500, lng: 35.5400 },
  { id: "9", name: "Centro de Saúde de Maxixe", type: "HOSPITAL", distance: "5.5 km", address: "Maxixe Baixa", phone: "+258 84 111 2222", isOpen: true, province: "Inhambane", lat: -23.8600, lng: 35.3400 },
  { id: "20", name: "Farmácia Esperança", type: "FARMÁCIA", distance: "1.2 km", address: "Terminal Rodoviário", phone: "+258 82 111 2233", isOpen: true, province: "Inhambane", lat: -23.8680, lng: 35.3810 },
  { id: "21", name: "Clínica de Cuidados Inhambane", type: "CLÍNICA", distance: "3.5 km", address: "Bairro Balane", phone: "+258 84 333 4455", isOpen: true, province: "Inhambane", lat: -23.8700, lng: 35.3780 },
  { id: "22", name: "Hospital Rural de Vilankulo", type: "HOSPITAL", distance: "250 km", address: "Vilankulo Sede", phone: "+258 86 555 6677", isOpen: true, province: "Inhambane", lat: -22.0160, lng: 35.3160 },
  // Sofala (-19.8436, 34.8389)
  { id: "10", name: "Hospital Central da Beira", type: "HOSPITAL", distance: "1.5 km", address: "Ponta Gêa", phone: "+258 84 333 4444", isOpen: true, province: "Sofala", lat: -19.8436, lng: 34.8389 },
  { id: "11", name: "Farmácia Moderna", type: "FARMÁCIA", distance: "2.0 km", address: "Macuti", phone: "+258 82 666 5555", isOpen: true, province: "Sofala", lat: -19.8400, lng: 34.8500 },
  { id: "12", name: "Clínica Sagrada Esperança", type: "CLÍNICA", distance: "4.2 km", address: "Manga", phone: "+258 84 999 0000", isOpen: true, province: "Sofala", lat: -19.8000, lng: 34.8500 },
  { id: "23", name: "Farmácia Munhava", type: "FARMÁCIA", distance: "6.1 km", address: "Bairro Munhava", phone: "+258 84 888 9900", isOpen: true, province: "Sofala", lat: -19.8250, lng: 34.8250 },
  { id: "24", name: "Clínica Pediátrica da Beira", type: "CLÍNICA", distance: "2.8 km", address: "Av. Eduardo Mondlane", phone: "+258 82 222 1122", isOpen: false, province: "Sofala", lat: -19.8350, lng: 34.8450 },
  // Nampula (-15.1165, 39.2666)
  { id: "13", name: "Hospital Central de Nampula", type: "HOSPITAL", distance: "2.8 km", address: "Av. Paulo Samuel Kankhomba", phone: "+258 84 888 7777", isOpen: true, province: "Nampula", lat: -15.1165, lng: 39.2666 },
  { id: "14", name: "Farmácia Caridade", type: "FARMÁCIA", distance: "1.1 km", address: "Bairro Muhala", phone: "+258 86 555 3333", isOpen: false, province: "Nampula", lat: -15.1200, lng: 39.2700 },
  { id: "15", name: "Clínica Esperança", type: "CLÍNICA", distance: "3.5 km", address: "Bairro Namicopo", phone: "+258 82 111 9999", isOpen: true, province: "Nampula", lat: -15.1100, lng: 39.2600 },
  { id: "25", name: "Farmácia Popular", type: "FARMÁCIA", distance: "1.5 km", address: "Mercado Central", phone: "+258 84 777 6655", isOpen: true, province: "Nampula", lat: -15.1150, lng: 39.2640 },
  { id: "26", name: "Clínica Namuhakala", type: "CLÍNICA", distance: "4.0 km", address: "Bairro Namuhakala", phone: "+258 82 999 8877", isOpen: true, province: "Nampula", lat: -15.1050, lng: 39.2550 },
  { id: "27", name: "Hospital Militar de Nampula", type: "HOSPITAL", distance: "3.2 km", address: "Av. FPLM", phone: "+258 86 123 9876", isOpen: true, province: "Nampula", lat: -15.1220, lng: 39.2750 }
];

const i18n = {
  PT: {
    search: "Pesquisar hospitais, clínicas...",
    all: "Todos",
    hosp: "Hospitais",
    clin: "Clínicas",
    pharm: "Farmácias",
    noResult: "Nenhuma instituição encontrada na sua área",
    open: "ABERTO",
    closed: "FECHADO",
    call: "Ligar",
    dir: "Direções",
    send: "Enviar Receita",
    sendSub: "Encontre medicamentos enviando fotos da sua receita.",
    cam: "Toque na câmera",
    gal: "ou seleccione da galeria",
    clear: "Formato Claro",
    clearSub: "A letra deve ser legível e os selos visíveis.",
    voice: "Assistente",
    voiceSub: "Diga o que procura...",
    tapSpeak: "Toque para falar...",
    cancel: "Cancelar",
    tabDir: "Diretório",
    tabRec: "Receitas",
    locDesc: "Localização",
    uploading: "A analisar a sua receita...",
    searching: "A procurar farmácias próximas...",
    chatMatched: "Farmácia parceira encontrada!",
    pharmacyMsg: "Olá, aqui é a {X}. Temos os medicamentos descritos na imagem disponíveis por {Y} MZN. Deseja efetuar a reserva para levantamento seguro?",
    replyYes: "Sim, por favor.",
    replyNo: "Não, obrigado.",
    reserveConfirm: "Reserva confirmada! O seu código foi gerado com sucesso.",
    typeMsg: "Escrever mensagem...",
    ticketTitle: "Reserva Confirmada!",
    ticketSub: "Apresente este código na farmácia para levantar a sua medicação.",
    newRec: "Nova Receita",
    codeLbl: "CÓDIGO DE LEVANTAMENTO",
    settingsTab: "Definições",
    themePref: "Aparência",
    light: "Claro",
    dark: "Escuro",
    sys: "Sistema",
    notifs: "Notificações PUSH",
    repErr: "Reportar Problema",
    help: "Ajuda & Detalhes",
    contactTitle: "Fale Connosco",
    contactSub: "Envie as suas dúvidas, sugestões ou reporte problemas técnicos de forma segura.",
    contactName: "Seu Nome",
    contactEmail: "Endereço de E-mail",
    contactSubject: "Assunto",
    contactMessage: "Sua Mensagem",
    contactSubmitting: "A processar...",
    contactSendCode: "Enviar Código de Verificação",
    contactVerifyTitle: "Verifique o seu E-mail",
    contactVerifySub: "Enviámos um código OTP de 6 dígitos para o e-mail {email}. Por favor, introduza-o abaixo.",
    contactVerifying: "A verificar código...",
    contactVerifyBtn: "Confirmar & Enviar",
    contactResendBtn: "Reenviar Código",
    contactResendIn: "Reenviar em {time}s",
    contactSuccessTitle: "Mensagem Enviada!",
    contactSuccessSub: "A sua mensagem foi verificada com sucesso. A nossa equipa irá analisar e responder o mais rápido possível.",
    contactClose: "Fechar",
    contactErrFill: "Por favor preencha todos os campos corretamente.",
    contactErrOtp: "Código inválido. Tente novamente.",
    contactSubjectBug: "Reportar Problema Técnico",
    contactSubjectFeedback: "Sugestão ou Feedback",
    contactSubjectQuestion: "Dúvida Geral",
    cartTitle: "Carrinho de Medicamentos",
    cartSub: "Confirme a lista de medicamentos extraídos da sua receita antes de efectuar o pagamento.",
    cartMedsHeader: "Medicamentos",
    cartQtyHeader: "Qtd",
    cartPriceHeader: "Subtotal",
    checkoutEmail: "Endereço de E-mail para Recibo",
    checkoutPhone: "Telemóvel M-Pesa (Vodacom)",
    checkoutBtn: "Pagar com M-Pesa",
    checkoutGoBack: "Voltar ao Chat",
    checkoutMpesaTitle: "Transacção M-Pesa",
    checkoutMpesaSub: "A enviar pedido de pagamento M-Pesa para o número {phone}. Por favor, verifique o seu telemóvel e introduza o PIN para autorizar.",
    checkoutMpesaWaiting: "A aguardar confirmação do PIN...",
    checkoutMpesaSec: "Segundos restantes",
    checkoutErrPhone: "Número M-Pesa inválido. Digite um número Vodacom com 9 dígitos (ex: 84XXXXXXX).",
    checkoutErrPay: "O pagamento falhou ou foi cancelado.",
    checkoutMpesaSuccess: "Pagamento verificado com sucesso!",
    orderReceiptSent: "Enviámos o recibo com os detalhes e código de levantamento para o seu e-mail: {email}.",
    orderPaidBadge: "Pago via M-Pesa",
    orderTxId: "Transacção M-Pesa"
  },
  EN: {
    search: "Search hospitals, clinics...",
    all: "All",
    hosp: "Hospitals",
    clin: "Clinics",
    pharm: "Pharmacies",
    noResult: "No facilities found in your area",
    open: "OPEN",
    closed: "CLOSED",
    call: "Call",
    dir: "Directions",
    send: "Upload Prescription",
    sendSub: "Find medicines by uploading your prescription.",
    cam: "Tap to open camera",
    gal: "or select from gallery",
    clear: "Clear format required",
    clearSub: "Ensure handwriting is readable and stamps visible.",
    voice: "Assistant",
    voiceSub: "Say what you are looking for...",
    tapSpeak: "Tap to speak...",
    cancel: "Cancel",
    tabDir: "Directory",
    tabRec: "Prescriptions",
    locDesc: "Location",
    uploading: "Analyzing prescription...",
    searching: "Searching nearby pharmacies...",
    chatMatched: "Partner pharmacy found!",
    pharmacyMsg: "Hello, this is {X}. We have the medicines described in the image available for {Y} MZN. Would you like to reserve them?",
    replyYes: "Yes, please.",
    replyNo: "No, thanks.",
    reserveConfirm: "Reservation confirmed! Your code has been generated successfully.",
    typeMsg: "Type message...",
    ticketTitle: "Reservation Confirmed!",
    ticketSub: "Show this code at the pharmacy to pick up your medication.",
    newRec: "New Prescription",
    codeLbl: "PICKUP CODE",
    settingsTab: "Settings",
    themePref: "Theme",
    light: "Light",
    dark: "Dark",
    sys: "System",
    notifs: "PUSH Notifications",
    repErr: "Report Error",
    help: "Help & Details",
    contactTitle: "Contact Us",
    contactSub: "Send your questions, suggestions, or report technical issues securely.",
    contactName: "Your Name",
    contactEmail: "Email Address",
    contactSubject: "Subject",
    contactMessage: "Your Message",
    contactSubmitting: "Processing...",
    contactSendCode: "Send Verification Code",
    contactVerifyTitle: "Verify Your Email",
    contactVerifySub: "We've sent a 6-digit OTP to {email}. Please enter it below.",
    contactVerifying: "Verifying code...",
    contactVerifyBtn: "Confirm & Submit",
    contactResendBtn: "Resend Code",
    contactResendIn: "Resend in {time}s",
    contactSuccessTitle: "Message Sent!",
    contactSuccessSub: "Your message has been verified successfully. Our team will review it and reply as soon as possible.",
    contactClose: "Close",
    contactErrFill: "Please fill in all fields correctly.",
    contactErrOtp: "Invalid code. Please try again.",
    contactSubjectBug: "Report Technical Issue",
    contactSubjectFeedback: "Suggestion or Feedback",
    contactSubjectQuestion: "General Inquiry",
    cartTitle: "Medicines Cart",
    cartSub: "Confirm the list of medicines extracted from your prescription before completing the payment.",
    cartMedsHeader: "Medicines",
    cartQtyHeader: "Qty",
    cartPriceHeader: "Subtotal",
    checkoutEmail: "Email Address for Receipt",
    checkoutPhone: "M-Pesa Mobile Number (Vodacom)",
    checkoutBtn: "Pay with M-Pesa",
    checkoutGoBack: "Back to Chat",
    checkoutMpesaTitle: "M-Pesa Transaction",
    checkoutMpesaSub: "Sending M-Pesa payment request to {phone}. Please check your phone and enter your PIN to authorize.",
    checkoutMpesaWaiting: "Waiting for PIN confirmation...",
    checkoutMpesaSec: "Seconds remaining",
    checkoutErrPhone: "Invalid M-Pesa number. Please enter a 9-digit Vodacom number (e.g. 84XXXXXXX).",
    checkoutErrPay: "Payment failed or was cancelled.",
    checkoutMpesaSuccess: "Payment verified successfully!",
    orderReceiptSent: "We've sent the receipt with details and pickup code to your email: {email}.",
    orderPaidBadge: "Paid via M-Pesa",
    orderTxId: "M-Pesa Transaction"
  },
  CHA: {
    search: "Lavalava zvibedhlela, maklinika...",
    all: "Hinkwaswo",
    hosp: "Zvibedhlela",
    clin: "Maklinika",
    pharm: "Mafirmaxi",
    noResult: "A ku na zvibedhlela ndhawini ya wena",
    open: "KUVURILE",
    closed: "KUPFARIWILE",
    call: "Nginga",
    dir: "Ndlela",
    send: "Rhumela Xitsalo",
    sendSub: "Kuma mimurhi hi ku rhumela xitsalo.",
    cam: "Khumba khemera",
    gal: "Kumbe hlawula ka galeria",
    clear: "Kuvonakala Kwinene",
    clearSub: "Tsalela swi vonaka kahle.",
    voice: "Mupfuni",
    voiceSub: "Vula lexi uxi lavalavaka...",
    tapSpeak: "Khumba u vulavula...",
    cancel: "Tshika",
    tabDir: "Ndhawu",
    tabRec: "Zvitsalo",
    locDesc: "Muthi",
    uploading: "Ku hlahluva xitsalo...",
    searching: "Ku lavalava mafirmaxi...",
    chatMatched: "Firmaxi yi kumiwile!",
    pharmacyMsg: "Xewani, leyi i {X}. Hi na mimurhi leyi hi {Y} MZN. Wa swi lava ku vekisa?",
    replyYes: "Ina, ndza kombela.",
    replyNo: "Ahihi, inkomu.",
    reserveConfirm: "Ku vekisa ku tiyisiwile! Kodigu ya wena yi humelele.",
    typeMsg: "Tsala mhaka...",
    ticketTitle: "Ku vekisa ku Tiyisiwile!",
    ticketSub: "Komba kodigu leyi ku kuma mimurhi.",
    newRec: "Xitsalo Xintshwa",
    codeLbl: "KODIGU YA WENA"
  },
  EMK: {
    search: "Phavela osipitali, ikilinika...",
    all: "Otheene",
    hosp: "Osipitali",
    clin: "Ikilinika",
    pharm: "Ifarmasi",
    noResult: "Khavo epuro awe vakhiviru",
    open: "OHULEYA",
    closed: "OWALIWA",
    call: "Likari",
    dir: "Ephiro",
    send: "Rumiha Ereseta",
    sendSub: "Phafwela mirette orumiha ereseta.",
    cam: "Kohaa ekanera",
    gal: "Nto othota ecentric",
    clear: "Erere Ophwanela",
    clearSub: "Sulela oweha saana.",
    voice: "Anaphuka",
    voiceSub: "Oloola ele ophavelave...",
    tapSpeak: "Kohaa wii we...",
    cancel: "Hiya",
    tabDir: "Ephiro",
    tabRec: "Ereseta",
    locDesc: "Epuro",
    uploading: "Oweha ereseta...",
    searching: "Ophavela ifarmasi vakhiviru...",
    chatMatched: "Ifarmasi ephwanyeni!",
    pharmacyMsg: "Makhale! Ela t' {X}. Nookhalano mirette {Y} MZN. Onaphavela wekisa?",
    replyYes: "Aayo, koxukuru.",
    replyNo: "Nna, koxukuru.",
    reserveConfirm: "Wekisa wotikithiriwa! Ekodigu ehipakiwa.",
    typeMsg: "Lepa...",
    ticketTitle: "Wekisa Wotikithiriwa!",
    ticketSub: "Woonihe ekodigu ofarmasi ovikela.",
    newRec: "Ereseta Eswa",
    codeLbl: "EKODIGU EPHIYOO"
  },
  NYA: {
    search: "Fufuzani zipatala, makliniki...",
    all: "Zonse",
    hosp: "Zipatala",
    clin: "Makliniki",
    pharm: "Mafarmasi",
    noResult: "Palibe malo osamalira mdera lanu",
    open: "YOTSEGULIDWA",
    closed: "YOTSEKEDWA",
    call: "Itanani",
    dir: "Njira",
    send: "Tumizani Reseta",
    sendSub: "Pezani mankhwala potumiza reseta yanu.",
    cam: "Dinani kamera",
    gal: "Sankhani muzithunzi",
    clear: "Iyenera kuoneka bwino",
    clearSub: "Onetsetsani kuti malembo akuwerengeka.",
    voice: "Mthandizi",
    voiceSub: "Nenani zomwe mukufuna...",
    tapSpeak: "Dinani kuti mulankhule...",
    cancel: "Kuletsa",
    tabDir: "Malo",
    tabRec: "Mareseta",
    locDesc: "Dera",
    uploading: "Kusanthula reseta...",
    searching: "Kufufuza mafarmasi pafupi...",
    chatMatched: "Farmasi yapezeka!",
    pharmacyMsg: "Muli bwanji, iyi ndi {X}. Tili ndi mankhwala opemphedwa a {Y} MZN. Kodi mukufuna kusunga?",
    replyYes: "Inde, chonde.",
    replyNo: "Ayi, zikomo.",
    reserveConfirm: "Kusunga kwatsimikiziridwa! Nambala yanu yapangidwa.",
    typeMsg: "Lembani mlandu...",
    ticketTitle: "Kusunga Kwatsimikiziridwa!",
    ticketSub: "Onetsani nambala iyi ku farmasi.",
    newRec: "Reseta Yatsopano",
    codeLbl: "NAMBALA YOTENGERA"
  },
  SEN: {
    search: "Kusaka vipatala, kliniki...",
    all: "Zyonsene",
    hosp: "Vipatala",
    clin: "Kliniki",
    pharm: "Farmasi",
    noResult: "Nkhabe mbuto mudziko yanu",
    open: "YABZULULWA",
    closed: "YAFUNGWA",
    call: "Cemera",
    dir: "Njira",
    send: "Tumiza Reseta",
    sendSub: "Gumanani miti nakutumiza reseta.",
    cam: "Ponya kamera",
    gal: "Kusankha mafoto",
    clear: "Kuwoneka kwadidi",
    clearSub: "Lemba yakubveka.",
    voice: "Mphedzi",
    voiceSub: "Longa cinafuna iwe...",
    tapSpeak: "Ponya toera kulonga...",
    cancel: "Leka",
    tabDir: "Njira",
    tabRec: "Mareseta",
    locDesc: "Mbuto",
    uploading: "Kusupenda reseta...",
    searching: "Kusaka farmasi...",
    chatMatched: "Farmasi yagumanika!",
    pharmacyMsg: "Ndalamba, ife ndife {X}. Tina miti iwe unfuna mu {Y} MZN. Usafuna kusunga?",
    replyYes: "Inde, taphata mwendo.",
    replyNo: "Nkhabe, ndatenda.",
    reserveConfirm: "Kusunga kwaphela! Kodigu yanu yacitwa.",
    typeMsg: "Nemba...",
    ticketTitle: "Kusunga kwaphela!",
    ticketSub: "Pangiza kodigu kubankgo.",
    newRec: "Reseta Yipswa",
    codeLbl: "KODIGU"
  },
  CHW: {
    search: "Funa ospitali, klinika...",
    all: "Dhotene",
    hosp: "Ospitali",
    clin: "Klinika",
    pharm: "Farmasi",
    noResult: "Khavo dhithu mmuruddani",
    open: "OHUGULIWA",
    closed: "OFUNGIWA",
    call: "Nginga",
    dir: "Nddila",
    send: "Ruma Reseta",
    sendSub: "Fwanya muredda oruma reseta.",
    cam: "Giinha camera",
    gal: "Ganha mmagaleria",
    clear: "Kovonela Ddene",
    clearSub: "Leva yononeya.",
    voice: "Mviri",
    voiceSub: "Ologa dhinafuna iwe...",
    tapSpeak: "Giinha wi ologe...",
    cancel: "Riya",
    tabDir: "Nddila",
    tabRec: "Reseta",
    locDesc: "Muthitho",
    uploading: "Oweha reseta...",
    searching: "Ofuna farmasi opagene...",
    chatMatched: "Farmasi efwanyiwa!",
    pharmacyMsg: "Naddini, ddi {X}. Nihika muredda wu {Y} MZN. Onfuna wekisa?",
    replyYes: "Inde, ddagukela.",
    replyNo: "Nnari, ddagukela.",
    reserveConfirm: "Owesa wekisa! Nambala ewu yakaritiwa.",
    typeMsg: "Leva...",
    ticketTitle: "Wekisa Wu!",
    ticketSub: "Goniha nambala mmufarmasi.",
    newRec: "Reseta Mphya",
    codeLbl: "NAMBALA"
  },
  YAO: {
    search: "Sosa cipatala, kiliniki...",
    all: "Yosope",
    hosp: "Sipatala",
    clin: "Kiliniki",
    pharm: "Faramasi",
    noResult: "Pangali yosope mumulango mwenu",
    open: "YOGULIKA",
    closed: "YOTINDIKWA",
    call: "Ilangine",
    dir: "Litala",
    send: "Dumisani Leseta",
    sendSub: "Pata mtela na dumisani leseta jenu.",
    cam: "Binya kamera",
    gal: "Sankhani ga galeria",
    clear: "Kuooneka Cenene",
    clearSub: "Lemba yakwoneka.",
    voice: "Nkamucisi",
    voiceSub: "Bececi cinecisosa...",
    tapSpeak: "Binya kukuta...",
    cancel: "Leka",
    tabDir: "Litala",
    tabRec: "Maleseta",
    locDesc: "Muhulo",
    uploading: "Kulola leseta...",
    searching: "Kusosa faramasi pafupi...",
    chatMatched: "Faramasi jipatikana!",
    pharmacyMsg: "Tinawu, aji ji {X}. Tukwete mtela wu {Y} MZN. Mkwecinjila wekise?",
    replyYes: "Elo, kwisa maji.",
    replyNo: "Nyee, mtendeje.",
    reserveConfirm: "Kwekisa kutimilila! Nambala jenu jigumbana.",
    typeMsg: "Lemba...",
    ticketTitle: "Kwekisa Kutimilila!",
    ticketSub: "Lola nambala ku faramasi.",
    newRec: "Leseta Yacimanyi",
    codeLbl: "NAMBALA"
  },
  MAK: {
    search: "Avala isipitali, ilinika...",
    all: "Dindiva",
    hosp: "Isipitali",
    clin: "Ilinika",
    pharm: "Ifarmasi",
    noResult: "Nanga imene mmati",
    open: "KUGUIKA",
    closed: "KUDIVALIKA",
    call: "Lyanga",
    dir: "Njila",
    send: "Uveka Leseta",
    sendSub: "Upata mitela na uveka leseta iwe.",
    cam: "Kanyanga kamera",
    gal: "Shaua ma foto",
    clear: "Ulowela Shinandi",
    clearSub: "Umanyi ulola.",
    voice: "Nkayavi",
    voiceSub: "Longa dhaulota...",
    tapSpeak: "Kanyanga ku longa...",
    cancel: "Leka",
    tabDir: "Njila",
    tabRec: "Maleseta",
    locDesc: "Muti",
    uploading: "Utangela leseta...",
    searching: "Avala ifarmasi padyambi...",
    chatMatched: "Ifarmasi idhioka!",
    pharmacyMsg: "Salama, dhi ni {X}. Ndi na mitela yi {Y} MZN. Ulota uveka?",
    replyYes: "Ena, ndikumbalela.",
    replyNo: "Nanga, ndikumbalela.",
    reserveConfirm: "Uveka unamalila! Nambala inauka.",
    typeMsg: "Lemba...",
    ticketTitle: "Uveka Unamalila!",
    ticketSub: "Lodya nambala ku farmasi.",
    newRec: "Leseta Ipya",
    codeLbl: "NAMBALA"
  }
};

const safeI18n = (lang) => {
  const current = i18n[lang] || i18n["PT"];
  return { ...i18n["PT"], ...current };
};

const languagesList = [
  { code: "PT", name: "Português" },
  { code: "EN", name: "English" },
  { code: "CHA", name: "Changana (PT)" },
  { code: "EMK", name: "Emakhuwa (PT)" },
  { code: "NYA", name: "Nyanja (PT)" },
  { code: "SEN", name: "Sena (PT)" },
  { code: "CHW", name: "Chwabo (PT)" },
  { code: "YAO", name: "Yao (PT)" },
  { code: "MAK", name: "Makonde (PT)" }
];

export default function GuiaSaudeBairro() {
  const [activeTab, setActiveTab] = useState("directory");
  const [language, setLanguage] = useState("PT");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [themePref, setThemePref] = useState("system");
  const [notifsEnabled, setNotifsEnabled] = useState(true);

  // Contact Form & OTP Verification State
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactStep, setContactStep] = useState("form"); // "form" | "otp" | "success"
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "Dúvida Geral", message: "" });
  const [contactOtp, setContactOtp] = useState(["", "", "", "", "", ""]);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [debugOtpCode, setDebugOtpCode] = useState("");



  // Timer effect for OTP resend countdown
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactError(t.contactErrFill);
      return;
    }
    if (!contactForm.email.includes("@")) {
      setContactError(t.contactErrFill);
      return;
    }

    setContactSubmitting(true);
    setContactError("");
    setDebugOtpCode("");

    try {
      const res = await fetch("/api/contact/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setContactStep("otp");
        setResendTimer(60);
        setContactOtp(["", "", "", "", "", ""]);
        if (data.debugOtp) {
          setDebugOtpCode(data.debugOtp);
        }
      } else {
        setContactError(data.error || "Erro ao processar envio do código.");
      }
    } catch (err) {
      console.error(err);
      setContactError("Erro de ligação. Verifique a sua ligação à internet.");
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const otpCode = contactOtp.join("");
    if (otpCode.length !== 6) {
      setContactError(t.contactErrOtp);
      return;
    }

    setContactSubmitting(true);
    setContactError("");

    try {
      const res = await fetch("/api/contact/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: contactForm.email,
          otp: otpCode
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setContactStep("success");
      } else {
        setContactError(data.error || t.contactErrOtp);
      }
    } catch (err) {
      console.error(err);
      setContactError("Erro ao verificar código.");
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || contactSubmitting) return;

    setContactSubmitting(true);
    setContactError("");
    setDebugOtpCode("");

    try {
      const res = await fetch("/api/contact/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResendTimer(60);
        setContactOtp(["", "", "", "", "", ""]);
        if (data.debugOtp) {
          setDebugOtpCode(data.debugOtp);
        }
      } else {
        setContactError(data.error || "Erro ao reenviar código.");
      }
    } catch (err) {
      console.error(err);
      setContactError("Erro ao reenviar código.");
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleOtpChange = (value, index) => {
    const val = value.replace(/[^0-9]/g, "");
    if (!val) {
      const newOtp = [...contactOtp];
      newOtp[index] = "";
      setContactOtp(newOtp);
      return;
    }
    const newOtp = [...contactOtp];
    newOtp[index] = val.substring(val.length - 1);
    setContactOtp(newOtp);

    // Auto focus next input
    if (index < 5) {
      setTimeout(() => {
        document.getElementById(`contact-otp-${index + 1}`)?.focus();
      }, 10);
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...contactOtp];
      if (contactOtp[index]) {
        newOtp[index] = "";
        setContactOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setContactOtp(newOtp);
        document.getElementById(`contact-otp-${index - 1}`)?.focus();
      }
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    
    const applyTheme = () => {
      if (themePref === 'dark') {
        root.classList.add('dark');
      } else if (themePref === 'light') {
        root.classList.remove('dark');
      } else if (mediaQuery) {
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();

    const listener = () => {
      if (themePref === 'system') applyTheme();
    };
    
    if (mediaQuery) {
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [themePref]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");

  // Real-time GPS Location State
  const [isLocating, setIsLocating] = useState(true);
  const [currentProvince, setCurrentProvince] = useState("A localizar...");

  // Chat Simulation State
  const [uploadStatus, setUploadStatus] = useState("idle"); 
  const [chatMessages, setChatMessages] = useState([]);
  const [chatData, setChatData] = useState({ pharmacyName: "", price: "", code: "" });
  const [previewImage, setPreviewImage] = useState(null);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const t = safeI18n(language);

  // M-Pesa Cart, Checkout & Payment State
  const [checkoutMeds, setCheckoutMeds] = useState([]);
  const [clientEmail, setClientEmail] = useState("");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [mpesaTransactionId, setMpesaTransactionId] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSubmitting, setCheckoutSubmitting] = useState(false);
  const [mpesaCountdown, setMpesaCountdown] = useState(0);

  // M-Pesa USSD Push Timer countdown effect
  useEffect(() => {
    let interval;
    if (mpesaCountdown > 0 && uploadStatus === "mpesa-loading") {
      interval = setInterval(() => {
        setMpesaCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mpesaCountdown, uploadStatus]);

  const handleMpesaCheckout = async (e) => {
    if (e) e.preventDefault();
    if (!clientEmail.trim() || !clientEmail.includes("@")) {
      setCheckoutError(t.contactErrFill);
      return;
    }
    
    const cleanPhone = mpesaPhone.trim().replace("+", "").replace(/\s/g, "");
    const mzPhoneRegex = /^(84|85)\d{7}$/;
    if (!mzPhoneRegex.test(cleanPhone)) {
      setCheckoutError(t.checkoutErrPhone);
      return;
    }

    setCheckoutError("");
    setCheckoutSubmitting(true);
    setMpesaCountdown(15);
    setUploadStatus("mpesa-loading");

    try {
      const cleanPriceStr = chatData.price.replace(/\./g, "").replace(/,/g, "");
      const totalAmount = parseInt(cleanPriceStr) || 1500;
      
      const res = await fetch("/api/payment/mpesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: clientEmail.trim(),
          phone: cleanPhone,
          amount: totalAmount,
          orderId: "ORD" + Math.random().toString(36).substring(2, 9).toUpperCase(),
          pharmacyName: chatData.pharmacyName,
          meds: checkoutMeds,
          code: chatData.code
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMpesaTransactionId(data.transactionId);
        setUploadStatus("ticket");
      } else {
        setCheckoutError(data.error || t.checkoutErrPay);
        setUploadStatus("cart");
      }
    } catch (err) {
      console.error(err);
      setCheckoutError("Erro de ligação ao processar pagamento.");
      setUploadStatus("cart");
    } finally {
      setCheckoutSubmitting(false);
    }
  };

  // Initialize Geolocation on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          let closestProv = "Maputo";
          let minDistance = Infinity;

          // Simple Pythagorean distance to find the closest mock region to the user's real GPS
          mockInstitutions.forEach(inst => {
             const dist = Math.pow(inst.lat - userLat, 2) + Math.pow(inst.lng - userLng, 2);
             if (dist < minDistance) {
               minDistance = dist;
               closestProv = inst.province;
             }
          });
          
          setCurrentProvince(closestProv);
          setIsLocating(false);
        },
        (error) => {
          console.warn("Geolocation denied or failed:", error);
          // Fallback to Maputo if permission denied or unavailable
          setCurrentProvince("Maputo");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setCurrentProvince("Maputo");
      setIsLocating(false);
    }
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = language === "EN" ? "en-US" : "pt-MZ";
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsListening(true);
      setVoiceTranscript("");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setVoiceTranscript(transcript);
      setTimeout(() => {
         setSearchQuery(transcript);
         setActiveTab("directory");
         setShowVoiceModal(false);
      }, 1500);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  useEffect(() => {
    if (showVoiceModal) {
      startListening();
    } else {
      setIsListening(false);
      setVoiceTranscript("");
    }
  }, [showVoiceModal]);

  const filteredInstitutions = useMemo(() => {
    let results = mockInstitutions.filter(i => i.province === currentProvince);
    if (activeFilter !== "All") {
      if (activeFilter === "Hospitals") results = results.filter(i => i.type === "HOSPITAL");
      else if (activeFilter === "Clinics") results = results.filter(i => i.type === "CLÍNICA");
      else if (activeFilter === "Pharmacies") results = results.filter(i => i.type === "FARMÁCIA");
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(i => i.name.toLowerCase().includes(q) || i.type.toLowerCase().includes(q));
    }
    return results;
  }, [searchQuery, activeFilter, currentProvince]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);

      // Transition to analysis
      setUploadStatus("loading");

      setTimeout(() => {
        // Randomize Pharmacy and Price
        const localPharmacies = mockInstitutions.filter(i => i.province === currentProvince && i.type === "FARMÁCIA" && i.isOpen);
        let pharmName = "Farmácia Parceira"; // fallback
        if (localPharmacies.length > 0) {
           const randomIdx = Math.floor(Math.random() * localPharmacies.length);
           pharmName = localPharmacies[randomIdx].name;
        }
        
        // Random Price between 500 and 5000 MZN
        const randomPrice = Math.floor(Math.random() * 4500) + 500;
        const formattedPrice = randomPrice.toLocaleString('pt-MZ');

        // Dynamic Message
        const randomCode = "#" + Math.random().toString(36).substr(2, 4).toUpperCase();
        setChatData({ pharmacyName: pharmName, price: formattedPrice, code: randomCode });
        const dynMsg = t.pharmacyMsg.replace("{X}", pharmName).replace("{Y}", formattedPrice);

        setUploadStatus("chat");
        setChatMessages([
          { sender: "system", text: t.chatMatched },
          { sender: "pharmacy", text: dynMsg, time: "Agora" }
        ]);
      }, 3500);
    }
  };

  const handleUserReply = (text) => {
    setChatMessages(prev => [...prev, { sender: "user", text, time: "Agora" }]);
    if (text === t.replyYes) {
      setTimeout(() => {
        setChatMessages(prev => [...prev, { sender: "pharmacy", text: t.reserveConfirm, time: "Agora" }]);
        setTimeout(() => {
          // Parse price string to number (remove any thousand separator dots)
          const cleanPriceStr = chatData.price.replace(/\./g, "").replace(/,/g, "");
          const totalPrice = parseInt(cleanPriceStr) || 1500;
          
          // Generate detailed medicine items that sum up to totalPrice
          const item1Price = Math.floor(totalPrice * 0.45);
          const item2PriceEach = Math.floor(totalPrice * 0.15); // x2 = 30%
          const item3Price = totalPrice - item1Price - (item2PriceEach * 2); // Remainder ensures mathematical match
          
          const meds = [
            { id: "m1", name: "Amoxicilina 500mg (Cápsulas)", qty: 1, price: item1Price },
            { id: "m2", name: "Paracetamol 500mg (Comprimidos)", qty: 2, price: item2PriceEach * 2, unitPrice: item2PriceEach },
            { id: "m3", name: "Multivitamínico (Xarope)", qty: 1, price: item3Price }
          ];
          
          setCheckoutMeds(meds);
          setClientEmail("");
          setMpesaPhone("");
          setMpesaTransactionId("");
          setCheckoutError("");
          setUploadStatus("cart");
        }, 3000);
      }, 1500);
    } else if (text === t.replyNo) {
      setTimeout(() => {
        setUploadStatus("idle");
        setChatMessages([]);
        setPreviewImage(null);
      }, 400); // Swift organic reset
    }
  };

  useEffect(() => {
    if (activeTab !== "recipes") {
       setTimeout(() => {
          setUploadStatus("idle");
          setChatMessages([]);
          setPreviewImage(null);
       }, 300);
    }
  }, [activeTab]);

  const renderHeader = () => (
    <header className="flex flex-col px-5 pt-8 pb-3 bg-white sticky top-0 z-50 border-b border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary-50 p-2 rounded-xl">
            <HeartPulse className="h-6 w-6 text-primary-600" />
          </div>
          <h1 className="text-[1.05rem] font-extrabold uppercase text-gray-900 tracking-tight leading-none">
            GUIA DE SAÚDE <br/><span className="text-primary-600">BAIRRO</span>
          </h1>
        </div>

        {/* Voice Assistant Button */}
        <button 
          onClick={() => setShowVoiceModal(true)}
          className="p-2.5 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-full transition-colors relative"
        >
          <Mic className="h-5 w-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 border border-white rounded-full"></span>
        </button>
      </div>

      <div className="flex items-center justify-between">
        {/* Real-time GPS Location Readout (No Dropdown) */}
        <div className="flex flex-col items-start px-2 py-1.5 rounded-lg">
          <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">{t.locDesc}</span>
          <span className="flex items-center gap-1.5 text-[13px] font-bold text-primary-700">
            {isLocating ? (
              <><Loader2 className="h-3 w-3 animate-spin text-primary-400" /> A obter GPS...</>
            ) : (
              <><MapPin className="h-3 w-3 text-primary-600" /> {currentProvince}</>
            )}
          </span>
        </div>

        {/* Language Selector and Settings */}
        <div className="flex items-center gap-2 relative">
          <button 
            onClick={() => setShowSettingsModal(true)}
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition"
          >
            <Settings className="h-5 w-5" />
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-sm font-bold text-gray-700 transition"
          >
            {language} <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
          
          <AnimatePresence>
            {showLangMenu && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-40 max-h-64 overflow-y-auto no-scrollbar bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50"
              >
                {languagesList.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                    className="w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium transition"
                  >
                    <span className={language === lang.code ? "text-primary-600 font-bold" : "text-gray-600"}>
                      {lang.name}
                    </span>
                    {language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-primary-600" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>
      </div>
    </header>
  );

  const renderDirectory = () => (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col px-5 py-6 gap-6"
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input 
          type="search"
          placeholder={t.search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border-0 shadow-sm rounded-2xl text-base text-gray-900 focus:ring-2 focus:ring-primary-500 placeholder:text-gray-400 outline-none transition-all"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[{id:"All", label: t.all}, {id:"Hospitals", label: t.hosp}, {id:"Clinics", label: t.clin}, {id:"Pharmacies", label: t.pharm}].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
              activeFilter === filter.id 
                ? "bg-primary-600 text-white" 
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 pb-28">
        {!isLocating && filteredInstitutions.length === 0 && (
          <div className="text-center py-12 text-gray-400">
             <MapPin className="h-10 w-10 mx-auto mb-3 opacity-20" />
             <p>{t.noResult}</p>
          </div>
        )}
        
        {filteredInstitutions.map((inst) => (
          <div key={inst.id} className="bg-white p-5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4 border border-gray-100/50">
            <div className="flex justify-between items-start gap-4">
               <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-extrabold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md tracking-wider">
                      {inst.type}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-gray-500">
                      <MapPin className="h-3 w-3" /> {inst.distance}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight pr-2">{inst.name}</h3>
               </div>
               <div className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm ${inst.isOpen ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${inst.isOpen ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {inst.isOpen ? t.open : t.closed}
               </div>
            </div>
            
            <div className="flex flex-col gap-1 text-sm text-gray-500 mt-1">
               <p className="flex items-center gap-2">
                 <MapPin className="h-4 w-4 text-gray-300" />
                 {inst.address}, {inst.province}
               </p>
               <a href={`tel:${inst.phone}`} className="flex items-center gap-2 text-primary-600 font-bold hover:underline">
                 <PhoneCall className="h-4 w-4 text-primary-400" />
                 {inst.phone}
               </a>
            </div>

            <div className="mt-1">
               <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(inst.name + ' ' + inst.address + ' ' + inst.province)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-primary-50 text-primary-700 font-bold py-3.5 rounded-2xl transition-colors min-h-[48px]"
               >
                 <Navigation className="h-4 w-4" />
                 {t.dir}
               </a>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderPrescriptions = () => {
    if (uploadStatus === "idle") {
      return (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex flex-col px-5 py-6 gap-6 pb-32"
        >
          <div className="text-center mb-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t.send}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">{t.sendSub}</p>
          </div>

          {/* Hidden File Input for actual Camera/Gallery upload */}
          <input 
             type="file" 
             ref={fileInputRef} 
             onChange={handleFileSelect} 
             accept="image/*" 
             capture="environment" 
             className="hidden" 
          />

          <button onClick={() => fileInputRef.current.click()} className="w-full bg-white dark:bg-slate-800 border-2 border-dashed border-primary-200 dark:border-slate-700/50 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-slate-700/50 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-colors min-h-[250px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
             <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <Camera className="h-8 w-8 text-primary-600 dark:text-primary-400" />
             </div>
             <div className="text-center">
                <p className="text-lg font-bold text-primary-700 dark:text-primary-400">{t.cam}</p>
                <p className="text-sm font-medium text-gray-400 dark:text-gray-500 mt-1">{t.gal}</p>
             </div>
          </button>

          <div className="bg-primary-50/50 dark:bg-slate-800 rounded-3xl p-5 border border-primary-100 dark:border-slate-700/50 flex items-start gap-4 shadow-sm">
             <div className="bg-white dark:bg-slate-700 p-2 rounded-xl shadow-sm mt-1 shrink-0">
                <FileText className="h-6 w-6 text-primary-500 dark:text-primary-400" />
             </div>
             <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">{t.clear}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t.clearSub}
                </p>
             </div>
          </div>
        </motion.div>
      );
    }
    
    if (uploadStatus === "loading") {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-[60vh] px-5 gap-6"
        >
           {previewImage ? (
             <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-4 border-primary-100 shadow-xl mb-2">
               <img src={previewImage} alt="Receita Preview" className="w-full h-full object-cover opacity-60" />
               <div className="absolute inset-0 flex items-center justify-center bg-primary-900/20">
                 <Loader2 className="h-8 w-8 text-white animate-spin drop-shadow-md" />
               </div>
             </div>
           ) : (
             <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center relative">
                 <div className="absolute inset-0 border-4 border-primary-200 rounded-full border-t-primary-600 animate-spin"></div>
                 <Search className="h-8 w-8 text-primary-600 animate-pulse" />
              </div>
           )}
           <div className="text-center">
             <h3 className="text-xl font-bold text-gray-900 mb-2">{t.uploading}</h3>
             <p className="text-gray-500 font-medium">{t.searching}</p>
           </div>
        </motion.div>
      );
    }

    if (uploadStatus === "cart") {
      return (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex flex-col px-5 py-6 gap-5 pb-32"
        >
          <div className="text-center mb-1">
            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">{t.cartTitle}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-xs leading-relaxed">{t.cartSub}</p>
          </div>

          {/* Meds List Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-gray-100 dark:border-slate-700/50 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-700/50 pb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.cartMedsHeader}</span>
              <div className="flex gap-8">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.cartQtyHeader}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.cartPriceHeader}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {checkoutMeds.map((med) => (
                <div key={med.id} className="flex justify-between items-center text-sm font-medium">
                  <span className="text-gray-800 dark:text-gray-200">{med.name}</span>
                  <div className="flex items-center gap-8">
                    <span className="text-gray-500 dark:text-gray-400">{med.qty}x</span>
                    <span className="text-gray-900 dark:text-gray-100 font-bold whitespace-nowrap">{med.price.toLocaleString('pt-MZ')} MZN</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-dashed border-gray-100 dark:border-slate-700/50 pt-4 mt-2 flex justify-between items-center">
              <span className="text-base font-black text-gray-900 dark:text-gray-100">Total</span>
              <span className="text-lg font-black text-primary-600 dark:text-primary-400">{chatData.price} MZN</span>
            </div>
            
            <div className="bg-primary-50/50 dark:bg-slate-700/30 rounded-2xl p-3 flex justify-between items-center text-xs font-bold text-primary-700 dark:text-primary-400 border border-primary-100/50 dark:border-slate-700/50">
              <span>Farmácia de Recolha:</span>
              <span>{chatData.pharmacyName}</span>
            </div>
          </div>

          {/* Billing / Payment Form */}
          <form onSubmit={handleMpesaCheckout} className="flex flex-col gap-4">
            {checkoutError && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold p-3.5 rounded-2xl flex items-center gap-2">
                <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                <span>{checkoutError}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">{t.checkoutEmail}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="exemplo@dominio.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-2xl text-[0.95rem] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">{t.checkoutPhone}</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  <PhoneCall className="h-5 w-5 text-gray-400" />
                  <span className="text-[0.95rem] font-bold text-gray-400 border-r border-gray-200 dark:border-slate-700/50 pr-2">+258</span>
                </div>
                <input
                  type="tel"
                  required
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength="9"
                  value={mpesaPhone}
                  onChange={(e) => setMpesaPhone(e.target.value)}
                  placeholder="84XXXXXXX"
                  className="w-full pl-28 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-2xl text-[0.95rem] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm font-bold tracking-wide"
                />
              </div>
            </div>

            {/* M-Pesa Checkout Button */}
            <button
              type="submit"
              disabled={checkoutSubmitting}
              className="w-full flex items-center justify-center gap-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-rose-600/20 active:scale-[0.99] cursor-pointer mt-2 select-none"
            >
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shrink-0">
                <span className="text-[10px] font-black text-rose-600">M</span>
              </div>
              <span>{t.checkoutBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => setUploadStatus("chat")}
              className="w-full text-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-bold py-2 text-sm transition"
            >
              {t.checkoutGoBack}
            </button>
          </form>
        </motion.div>
      );
    }

    if (uploadStatus === "mpesa-loading") {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-[70vh] px-5 gap-6 text-center"
        >
          <div className="relative">
            {/* Pulsing ring */}
            <div className="absolute inset-0 bg-rose-100 dark:bg-rose-950/35 rounded-full animate-ping opacity-60" />
            <div className="absolute -inset-4 bg-rose-50 dark:bg-rose-950/20 rounded-full animate-pulse" />
            <div className="relative w-24 h-24 bg-rose-600 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-4xl font-black text-white leading-none">M</span>
            </div>
            <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-md">
              <Loader2 className="h-5 w-5 text-rose-600 animate-spin" />
            </div>
          </div>

          <div className="flex flex-col gap-2 max-w-xs">
            <h3 className="text-xl font-black text-gray-900 dark:text-gray-100">{t.checkoutMpesaTitle}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
              {t.checkoutMpesaSub.replace("{phone}", "+258 " + mpesaPhone)}
            </p>
          </div>

          <div className="bg-rose-50 dark:bg-rose-950/10 border border-rose-100/50 dark:border-rose-900/20 rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-sm mt-2">
            <span className="text-sm font-bold text-rose-700 dark:text-rose-400">{t.checkoutMpesaWaiting}</span>
            <div className="bg-rose-600 text-white font-extrabold text-xs w-6 h-6 rounded-full flex items-center justify-center">
              {mpesaCountdown}
            </div>
          </div>
        </motion.div>
      );
    }

    if (uploadStatus === "ticket") {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col px-5 py-6 gap-6 pb-32 min-h-[75vh] justify-center"
        >
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-slate-700/50 flex flex-col items-center text-center relative overflow-hidden">
             <div className={`absolute top-0 left-0 right-0 h-2 ${mpesaTransactionId ? 'bg-rose-600' : 'bg-emerald-500'}`}></div>
             
             {mpesaTransactionId && (
               <div className="absolute top-4 right-4 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-rose-100 dark:border-rose-900/30 flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                 {t.orderPaidBadge}
               </div>
             )}

             <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 mt-2 ${mpesaTransactionId ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400' : 'bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600'}`}>
                {mpesaTransactionId ? (
                  <span className="text-2xl font-black leading-none select-none">M</span>
                ) : (
                  <CheckCircle2 className="h-8 w-8" />
                )}
             </div>

             <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-1">
               {mpesaTransactionId ? t.checkoutMpesaSuccess : t.ticketTitle}
             </h3>
             <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed px-4">
               {mpesaTransactionId 
                 ? t.orderReceiptSent.replace("{email}", clientEmail)
                 : t.ticketSub}
             </p>

             <div className="w-full border-t-2 border-dashed border-gray-100 dark:border-slate-700/50 my-1"></div>
             
             <div className="flex flex-col items-center my-4">
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 tracking-widest mb-1.5 uppercase">{t.codeLbl}</span>
                <span className="text-3xl font-black text-primary-600 dark:text-primary-400 tracking-widest">{chatData.code}</span>
             </div>

             {/* If paid via M-Pesa, show detailed receipt items */}
             {mpesaTransactionId ? (
               <>
                 <div className="w-full border-t-2 border-dashed border-gray-100 dark:border-slate-700/50 my-1"></div>
                 <div className="w-full flex flex-col gap-2 my-3 text-left">
                   <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 tracking-widest uppercase mb-1">Itens Comprados</span>
                   {checkoutMeds.map((med) => (
                     <div key={med.id} className="flex justify-between items-center text-xs font-semibold">
                       <span className="text-gray-600 dark:text-gray-300">{med.name}</span>
                       <div className="flex gap-4">
                         <span className="text-gray-400">{med.qty}x</span>
                         <span className="text-gray-800 dark:text-gray-200">{med.price.toLocaleString('pt-MZ')} MZN</span>
                       </div>
                     </div>
                   ))}
                   <div className="flex justify-between items-center text-xs font-bold text-primary-600 dark:text-primary-400 border-t border-gray-50 dark:border-slate-700/50 pt-2 mt-1">
                     <span>{t.orderTxId} (Ref)</span>
                     <span className="font-mono">{mpesaTransactionId}</span>
                   </div>
                 </div>
               </>
             ) : null}

             <div className="w-full border-t-2 border-dashed border-gray-100 dark:border-slate-700/50 my-1"></div>

             <div className="w-full bg-gray-50 dark:bg-slate-700/20 rounded-2xl p-4 flex justify-between items-center text-sm font-bold mt-3 border border-gray-100/50 dark:border-slate-700/30">
                <span className="text-gray-600 dark:text-gray-300">{chatData.pharmacyName}</span>
                <span className="text-primary-700 dark:text-primary-400">{chatData.price} MZN</span>
             </div>
          </div>

          <button 
             onClick={() => { setUploadStatus("idle"); setChatMessages([]); setPreviewImage(null); setMpesaTransactionId(""); }}
             className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-primary-600/30 active:scale-[0.99] select-none"
          >
             <UploadCloud className="h-5 w-5" />
             {t.newRec}
          </button>
        </motion.div>
      );
    }

    // Chat Interface
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-full bg-slate-50 pb-28 min-h-[85vh]"
      >
        <div className="bg-white px-5 py-4 flex items-center gap-3 border-b border-gray-100 shadow-sm sticky top-0 z-10">
           <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
             <MessageSquare className="h-5 w-5 text-primary-600" />
           </div>
           <div>
             <h3 className="text-[1.05rem] font-bold text-gray-900">Rede de Farmácias</h3>
             <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online</p>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 gap-4 flex flex-col">
          {chatMessages.map((msg, i) => {
            if (msg.sender === "system") {
              return (
                <div key={i} className="flex justify-center my-2">
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100">
                    {msg.text}
                  </span>
                </div>
              );
            }
            const isUser = msg.sender === "user";
            return (
              <div key={i} className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[85%] ${isUser ? "self-end" : "self-start"}`}>
                <div className={`p-4 rounded-2xl shadow-sm text-[0.95rem] leading-relaxed ${isUser ? "bg-primary-600 text-white rounded-tr-sm" : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"}`}>
                  {msg.text}
                </div>
                <span className="text-[10px] font-bold text-gray-400 mt-1 px-1">{msg.time}</span>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Action Buttons for User Reply */}
        <div className="px-4 py-3 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto no-scrollbar fixed bottom-24 w-full max-w-md">
           <button 
            onClick={() => handleUserReply(t.replyYes)}
            className="whitespace-nowrap bg-primary-50 text-primary-700 hover:bg-primary-100 px-5 py-2.5 rounded-full text-sm font-bold transition border border-primary-100"
           >
             {t.replyYes}
           </button>
           <button 
            onClick={() => handleUserReply(t.replyNo)}
            className="whitespace-nowrap bg-gray-50 text-gray-600 hover:bg-gray-100 px-5 py-2.5 rounded-full text-sm font-bold transition border border-gray-200"
           >
             {t.replyNo}
           </button>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {renderHeader()}
      
      <div className="flex-1 overflow-y-auto no-scrollbar relative min-h-screen pb-[60px]">
         <AnimatePresence mode="wait">
            {activeTab === "directory" && <div key="dir" className="absolute inset-0">{renderDirectory()}</div>}
            {activeTab === "recipes" && <div key="rec" className="absolute inset-0">{renderPrescriptions()}</div>}
         </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="px-6 py-4 fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#F5F7FA] via-[#F5F7FA] to-transparent pb-[calc(1rem+env(safe-area-inset-bottom))] max-w-md mx-auto">
        <div className="bg-white rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100/50 flex justify-around items-center p-2 relative z-50">
          <button 
            onClick={() => setActiveTab("directory")}
            className={`flex flex-col items-center justify-center flex-1 h-[60px] rounded-full transition-colors relative z-10 ${activeTab === "directory" ? "text-white" : "text-gray-400 hover:text-gray-600"}`}
          >
            {activeTab === "directory" && (
              <motion.div layoutId="nav-bg" className="absolute inset-0 bg-primary-600 rounded-[1.5rem] shadow-md shadow-primary-600/30 z-[-1]" />
            )}
            <MapPin className={`h-5 w-5 mb-0.5 ${activeTab === "directory" ? "fill-primary-500" : ""}`} />
            <span className="text-[11px] font-bold tracking-wide">{t.tabDir}</span>
          </button>

          <button 
            onClick={() => setActiveTab("recipes")}
            className={`flex flex-col items-center justify-center flex-1 h-[60px] rounded-full transition-colors relative z-10 ${activeTab === "recipes" ? "text-white" : "text-gray-400 hover:text-gray-600"}`}
          >
            {activeTab === "recipes" && (
              <motion.div layoutId="nav-bg" className="absolute inset-0 bg-primary-600 rounded-[1.5rem] shadow-md shadow-primary-600/30 z-[-1]" />
            )}
            <UploadCloud className={`h-5 w-5 mb-0.5 ${activeTab === "recipes" ? "fill-primary-500" : ""}`} />
            <span className="text-[11px] font-bold tracking-wide">{t.tabRec}</span>
          </button>
        </div>
      </div>

      {/* Voice Assistant Modal Overlay */}
      <AnimatePresence>
        {showVoiceModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowVoiceModal(false)}
               className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ y: "100%" }}
               animate={{ y: 0 }}
               exit={{ y: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="w-full max-w-md bg-white rounded-t-[2.5rem] shadow-2xl relative z-10 p-8 flex flex-col items-center sm:rounded-[2.5rem] sm:mb-10 sm:max-w-sm"
             >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-8" />
                
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{t.voice}</h3>
                <p className="text-gray-500 text-center font-medium mb-10 text-sm">{t.voiceSub}</p>

                <div className="relative mb-8">
                   {isListening && <div className="absolute inset-0 bg-primary-100 rounded-full animate-ping opacity-50" />}
                   {isListening && <div className="absolute -inset-4 bg-primary-50 rounded-full animate-pulse" />}
                   <button onClick={() => !isListening && startListening()} className={`relative w-24 h-24 transition flex items-center justify-center rounded-full shadow-xl shadow-primary-600/30 ${isListening ? "bg-primary-600 hover:bg-primary-700" : "bg-gray-300 hover:bg-gray-400"}`}>
                      <Mic className="h-10 w-10 text-white" />
                   </button>
                </div>

                <p className={`font-bold text-lg text-center px-4 ${voiceTranscript ? 'text-gray-900' : 'text-primary-600 animate-pulse'}`}>
                  {voiceTranscript ? `"${voiceTranscript}"` : t.tapSpeak}
                </p>

                <button 
                  onClick={() => setShowVoiceModal(false)}
                  className="mt-8 px-8 py-3 bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 rounded-full transition"
                >
                  {t.cancel}
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal Overlay */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowSettingsModal(false)}
               className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ y: "100%" }}
               animate={{ y: 0 }}
               exit={{ y: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="w-full max-w-md bg-[var(--background)] rounded-t-[2.5rem] shadow-2xl relative z-10 p-6 flex flex-col sm:rounded-[2.5rem] sm:mb-10 sm:max-w-sm max-h-[85vh] overflow-y-auto no-scrollbar"
             >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
                
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-2xl font-extrabold text-[var(--foreground)]">{t.settingsTab}</h3>
                   <button onClick={() => setShowSettingsModal(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500">
                     <X className="h-5 w-5" />
                   </button>
                </div>

                <div className="flex flex-col gap-6 w-full">
                   {/* Theme Settings */}
                   <div className="flex flex-col gap-3">
                     <span className="text-sm font-bold text-gray-400 tracking-wider uppercase px-1">{t.themePref}</span>
                     <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-1 flex items-center justify-between shadow-sm">
                        <button onClick={() => setThemePref('light')} className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all ${themePref === 'light' ? 'bg-primary-50 text-primary-700 shadow-sm font-bold' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>
                           <Sun className="h-5 w-5" />
                           <span className="text-xs">{t.light}</span>
                        </button>
                        <button onClick={() => setThemePref('dark')} className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all ${themePref === 'dark' ? 'bg-gray-800 dark:bg-slate-700 text-white shadow-sm font-bold' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>
                           <Moon className="h-5 w-5" />
                           <span className="text-xs">{t.dark}</span>
                        </button>
                        <button onClick={() => setThemePref('system')} className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all ${themePref === 'system' ? 'bg-primary-50 text-primary-700 shadow-sm font-bold' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>
                           <Monitor className="h-5 w-5" />
                           <span className="text-xs">{t.sys}</span>
                        </button>
                     </div>
                   </div>

                   {/* Notifications */}
                   <div className="flex items-center justify-between bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-full ${notifsEnabled ? 'bg-primary-50 text-primary-600' : 'bg-gray-100 dark:bg-slate-700 text-gray-400'}`}>
                            <Bell className="h-5 w-5" />
                         </div>
                         <span className="font-bold text-[var(--foreground)]">{t.notifs}</span>
                      </div>
                      <button 
                         onClick={async () => {
                           if (!("Notification" in window)) return;
                           if (!notifsEnabled) {
                              const permission = await Notification.requestPermission();
                              if (permission === "granted") {
                                 setNotifsEnabled(true);
                                 new Notification("Notificações Ativadas!", { body: "Irá receber alertas de disponibilidade em farmácias e clínicas próximas." });
                              }
                           } else {
                              setNotifsEnabled(false);
                           }
                         }}
                         className={`w-12 h-6 rounded-full relative transition-colors ${notifsEnabled ? 'bg-primary-500' : 'bg-gray-300 dark:bg-slate-600'}`}
                      >
                         <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${notifsEnabled ? 'left-6' : 'left-0.5'}`} />
                      </button>
                   </div>

                   {/* Help & Details */}
                   <button 
                     onClick={() => alert("Guia de Saúde Bairro\n\nVersão: 1.0.0\nAplicativo inteligente para busca de assistência médica especializada e gestão de receitas nas principais farmácias de Moçambique.\n\nDesenvolvido focando acessibilidade e inclusão digital.")}
                     className="flex items-center justify-between bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-transform w-full"
                   >
                      <div className="flex items-center gap-3">
                         <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                            <HelpCircle className="h-5 w-5" />
                         </div>
                         <span className="font-bold text-[var(--foreground)]">{t.help}</span>
                      </div>
                   </button>

                   {/* Contact Support */}
                   <button 
                     onClick={() => {
                       setShowSettingsModal(false);
                       setContactForm({ name: "", email: "", subject: "Dúvida Geral", message: "" });
                       setContactError("");
                       setContactStep("form");
                       setDebugOtpCode("");
                       setShowContactModal(true);
                     }}
                     className="flex items-center justify-between bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-transform w-full"
                   >
                      <div className="flex items-center gap-3">
                         <div className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                            <MessageSquare className="h-5 w-5" />
                         </div>
                         <span className="font-bold text-[var(--foreground)]">{t.contactTitle}</span>
                      </div>
                   </button>

                   {/* Report Error */}
                   <button 
                     onClick={() => {
                       setShowSettingsModal(false);
                       setContactForm({ name: "", email: "", subject: "Reportar Problema Técnico", message: "" });
                       setContactError("");
                       setContactStep("form");
                       setDebugOtpCode("");
                       setShowContactModal(true);
                     }}
                     className="flex items-center justify-between bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl shadow-sm active:scale-[0.98] transition-transform group mt-2 w-full animate-pulse-slow"
                   >
                      <div className="flex items-center gap-3">
                         <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 group-hover:bg-red-200 transition-colors">
                            <AlertTriangle className="h-5 w-5" />
                         </div>
                         <span className="font-bold text-red-700 dark:text-red-400 tracking-wide">{t.repErr}</span>
                      </div>
                   </button>

                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contact Form Modal Overlay */}
      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!contactSubmitting) setShowContactModal(false);
              }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[2.5rem] shadow-2xl relative z-10 p-6 flex flex-col sm:rounded-[2.5rem] sm:mb-10 sm:max-w-sm max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              <div className="w-12 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto mb-6 shrink-0" />

              {/* Step 1: Contact Form Input */}
              {contactStep === "form" && (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{t.contactTitle}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.contactSub}</p>
                    </div>
                    <button
                      onClick={() => setShowContactModal(false)}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition shrink-0"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {contactError && (
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold p-3.5 rounded-2xl flex items-center gap-2 animate-shake">
                      <AlertTriangle className="h-5 w-5 shrink-0" />
                      <span>{contactError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">{t.contactName}</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700/50 rounded-2xl text-[0.95rem] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                          placeholder={language === "EN" ? "John Doe" : "Ex: João Silva"}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">{t.contactEmail}</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700/50 rounded-2xl text-[0.95rem] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                          placeholder="exemplo@dominio.com"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">{t.contactSubject}</label>
                      <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                          className="w-full pl-12 pr-10 py-3.5 bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700/50 rounded-2xl text-[0.95rem] text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all appearance-none"
                        >
                          <option value="Dúvida Geral">{t.contactSubjectQuestion}</option>
                          <option value="Reportar Problema Técnico">{t.contactSubjectBug}</option>
                          <option value="Sugestão ou Feedback">{t.contactSubjectFeedback}</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">{t.contactMessage}</label>
                      <textarea
                        required
                        rows="4"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700/50 rounded-2xl text-[0.95rem] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                        placeholder={language === "EN" ? "How can we help you?" : "Escreva a sua mensagem..."}
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={contactSubmitting}
                      className="w-full flex items-center justify-center gap-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-primary-600/25 disabled:opacity-50 mt-2 select-none active:scale-[0.99] cursor-pointer"
                    >
                      {contactSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>{t.contactSubmitting}</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>{t.contactSendCode}</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Step 2: OTP Verification */}
              {contactStep === "otp" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => {
                        setContactStep("form");
                        setContactError("");
                      }}
                      className="p-2 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-500 transition shrink-0"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">{t.contactVerifyTitle}</h3>
                    <button
                      onClick={() => setShowContactModal(false)}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition shrink-0"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed px-2">
                    {t.contactVerifySub.replace("{email}", contactForm.email)}
                  </p>

                  {/* Debug OTP Banner (Development Mode Simulation Assist) */}
                  {debugOtpCode && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-medium p-3 rounded-2xl flex flex-col items-center gap-1.5 shadow-sm">
                      <span className="flex items-center gap-1 font-bold uppercase tracking-wider text-[10px] text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="h-4 w-4" /> Modo de Desenvolvimento
                      </span>
                      <span>
                        Para testar sem configurar o e-mail, utilize o código OTP: <strong className="text-sm font-extrabold tracking-widest text-primary-600 dark:text-primary-400 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-md ml-1">{debugOtpCode}</strong>
                      </span>
                    </div>
                  )}

                  {contactError && (
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold p-3.5 rounded-2xl flex items-center gap-2 animate-shake">
                      <AlertTriangle className="h-5 w-5 shrink-0" />
                      <span>{contactError}</span>
                    </div>
                  )}

                  <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6 mt-2">
                    {/* OTP Inputs */}
                    <div className="flex justify-between gap-2 px-1">
                      {contactOtp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`contact-otp-${idx}`}
                          type="text"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          maxLength="1"
                          required
                          value={digit}
                          onChange={(e) => handleOtpChange(e.target.value, idx)}
                          onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                          className="w-12 h-14 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700/50 rounded-2xl text-center text-2xl font-black text-primary-600 dark:text-primary-400 focus:bg-white dark:focus:bg-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
                        />
                      ))}
                    </div>

                    {/* Resend Options */}
                    <div className="flex justify-center items-center text-sm">
                      {resendTimer > 0 ? (
                        <span className="text-gray-400 font-medium">
                          {t.contactResendIn.replace("{time}", resendTimer)}
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={contactSubmitting}
                          onClick={handleResendOtp}
                          className="text-primary-600 dark:text-primary-400 font-bold hover:underline cursor-pointer disabled:opacity-50"
                        >
                          {t.contactResendBtn}
                        </button>
                      )}
                    </div>

                    {/* Verify Button */}
                    <button
                      type="submit"
                      disabled={contactSubmitting || contactOtp.some(d => d === "")}
                      className="w-full flex items-center justify-center gap-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-primary-600/25 disabled:opacity-50 select-none active:scale-[0.99] cursor-pointer"
                    >
                      {contactSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>{t.contactVerifying}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-5 w-5" />
                          <span>{t.contactVerifyBtn}</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Step 3: Success View */}
              {contactStep === "success" && (
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                  </div>

                  <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-2">{t.contactSuccessTitle}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8 px-2">
                    {t.contactSuccessSub}
                  </p>

                  <button
                    onClick={() => setShowContactModal(false)}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-primary-600/25 active:scale-[0.99] cursor-pointer"
                  >
                    {t.contactClose}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
