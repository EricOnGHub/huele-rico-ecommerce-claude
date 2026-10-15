// Contenido de las páginas informativas en español (/es/pages/…).
// Las políticas son plantillas generales: revísalas antes de publicar.

import Link from "next/link";
import type { FaqItem, Page } from "./pages";
import { site } from "./site";

export const faqsEs: FaqItem[] = [
  {
    q: "¿Sus fragancias son 100% originales?",
    a: "Sí, siempre. Cada perfume y loción que vendemos es un producto de diseñador original, sellado de fábrica y obtenido de canales de distribución confiables. Nunca vendemos testers como nuevos, decants, imitaciones ni aromas “inspirados en”. Si algo que enviamos no es auténtico, te devolvemos todo tu dinero.",
  },
  {
    q: "¿Cómo pueden tener precios por debajo de la tienda?",
    a: "Compramos por volumen a distribuidores autorizados y mayoristas, mantenemos costos bajos como marca digital y te pasamos el ahorro. El mismo frasco, el mismo perfume: huele rico, paga menos.",
  },
  {
    q: "¿Qué tan rápido es el envío?",
    a: `Los pedidos salen en 1 a 2 días hábiles. La entrega estándar en EE. UU. suele tardar de 2 a 5 días hábiles y el envío es gratis en pedidos de más de $${site.freeShippingThreshold}. Recibirás tu número de rastreo por correo en cuanto salga tu pedido.`,
  },
  {
    q: "¿Envían fuera de Estados Unidos?",
    a: "Por ahora enviamos dentro de EE. UU., incluido Puerto Rico. ¡Muy pronto haremos envíos internacionales!",
  },
  {
    q: "¿Cuál es su política de devoluciones?",
    a: "Puedes devolver artículos sin abrir ni usar, en su empaque sellado original, dentro de 30 días después de la entrega para un reembolso completo. Por higiene y seguridad, no aceptamos fragancias abiertas, a menos que hayan llegado dañadas o equivocadas.",
  },
  {
    q: "Mi pedido llegó dañado. ¿Qué hago?",
    a: "¡Lo sentimos mucho! Escríbenos dentro de 7 días después de la entrega con tu número de pedido y una foto del artículo y del empaque, y te enviaremos un reemplazo o te haremos el reembolso de inmediato.",
  },
  {
    q: "¿Cuál es la diferencia entre Parfum, Eau de Parfum y Eau de Toilette?",
    a: "Es la concentración de aceites de fragancia. El Parfum (o Elixir) es el más concentrado y el que más dura; el Eau de Parfum (EDP) es intenso y dura casi todo el día; y el Eau de Toilette (EDT) es más ligero y fresco, ideal para el día y el calor.",
  },
  {
    q: "¿Ofrecen envoltura de regalo?",
    a: "Cada pedido ya llega listo para regalar en nuestra caja color ciruela con papel de seda con monograma y una tarjeta de agradecimiento bilingüe. Los precios nunca aparecen en la nota de envío.",
  },
  {
    q: "Do you speak English?",
    a: "Of course! Our team speaks English and Spanish. Write to us in whichever language you prefer.",
  },
];

export const pagesEs: Record<string, Page> = {
  about: {
    title: "Nuestra Historia",
    eyebrow: "Our Story",
    description:
      "Huele Rico! hace que las fragancias de diseñador sean accesibles, confiables y cercanas a nuestra cultura: perfumes y lociones 100% originales por debajo del precio de tienda.",
    body: (
      <>
        <p className="lead">Huele Rico! nació de una idea sencilla: todos merecemos oler increíble, sin pagar los precios inflados de las tiendas departamentales.</p>
        <p>
          Al crecer, un buen perfume era cosa de ocasiones especiales. El frasco del tocador que solo salía para bodas, quinceañeras y la misa del domingo.
          Quisimos cambiar eso. Nuestra misión es que las fragancias de diseñador se sientan más accesibles, confiables y cercanas a nuestra cultura.
        </p>
        <h2>Lujo inteligente, solo originales</h2>
        <p>
          Solo vendemos perfumes y lociones de diseñador auténticos: sin imitaciones, sin decants, sin “inspirados en”. Compramos de forma inteligente y
          operamos como marca digital, así que el ahorro es real. El mismo frasco. Mejor precio. <strong>Huele Rico, Paga Menos.</strong>
        </p>
        <h2>Una marca, dos voces</h2>
        <p>
          Hablamos español e inglés, porque nuestra comunidad también. Somos seguros, cálidos, aspiracionales y, sobre todo, confiables. Nos ganamos esa
          confianza con autenticidad, transparencia y calidad constante en cada pedido.
        </p>
        <h2>Hecho para regalar</h2>
        <p>
          Desde nuestras cajas color ciruela de tacto suave hasta el sello dorado y la tarjeta de agradecimiento bilingüe, cada pedido está pensado para sentirse
          como un regalo, incluso cuando es para ti.
        </p>
        <p className="script">Huele bien. Vive mejor.</p>
        <p>
          <Link href="/es/collections/best-sellers/" className="btn btn-primary">
            Ver Más Vendidos
          </Link>
        </p>
      </>
    ),
  },
  authenticity: {
    title: "Nuestra Promesa de Autenticidad",
    eyebrow: "Autenticidad · Confianza · Esencia",
    description:
      "Cada fragancia de Huele Rico! es 100% original, sellada de fábrica y respaldada por una garantía de reembolso. 100% original o te devolvemos tu dinero.",
    body: (
      <>
        <div className="callout">
          <strong>100% original o te devolvemos tu dinero.</strong> Si algún producto que recibas de nosotros no es auténtico, te reembolsamos la compra
          completa, incluido el envío.
        </div>
        <h2>De dónde vienen nuestras fragancias</h2>
        <p>
          Compramos exclusivamente a distribuidores autorizados y mayoristas establecidos y verificados. Nunca compramos a revendedores desconocidos y nunca
          vendemos imitaciones, aromas “inspirados en”, frascos rellenados ni decants.
        </p>
        <h2>Cómo revisamos cada frasco</h2>
        <ul>
          <li>Verificamos que los códigos de lote de la caja y del frasco coincidan.</li>
          <li>Revisamos empaque, celofán, impresión y calidad del frasco contra los estándares de la marca.</li>
          <li>Guardamos los productos en un lugar con clima controlado, lejos del calor y la luz directa.</li>
          <li>Cada pedido va sellado con nuestra etiqueta de autenticidad Huele Rico!.</li>
        </ul>
        <h2>Por qué los precios son más bajos que en tienda</h2>
        <p>
          Las tiendas departamentales cargan con muchos gastos: renta, personal, exhibidores. Como marca digital compramos por volumen y mantenemos costos
          bajos, así que el ahorro regresa a ti. De eso se trata: huele rico, paga menos.
        </p>
        <h2>¿Preguntas?</h2>
        <p>
          Nuestro equipo te ayuda con gusto, en español o en inglés. <Link href="/es/pages/contact/">Contáctanos</Link> cuando quieras.
        </p>
      </>
    ),
  },
  "shipping-returns": {
    title: "Envíos y Devoluciones",
    eyebrow: "Shipping & Returns",
    description: `Envío rápido y gratis en EE. UU. en pedidos de $${site.freeShippingThreshold}+, salida en 1–2 días hábiles y devoluciones fáciles en 30 días en fragancias sin abrir.`,
    body: (
      <>
        <h2>Envíos</h2>
        <ul>
          <li>
            <strong>Envío estándar gratis</strong> en pedidos de ${site.freeShippingThreshold} o más dentro de EE. UU.
          </li>
          <li>Los pedidos se procesan y envían en 1 a 2 días hábiles (lunes a viernes, sin contar días festivos).</li>
          <li>La entrega estándar suele llegar en 2 a 5 días hábiles. Hay opciones exprés al pagar.</li>
          <li>Enviamos a los 50 estados y a Puerto Rico. Los envíos internacionales llegarán pronto.</li>
          <li>Recibirás tu número de rastreo por correo en cuanto salga tu pedido.</li>
        </ul>
        <p className="muted">Las fragancias contienen alcohol y se envían por tierra, según las reglas de las paqueterías para productos de consumo.</p>
        <h2>Devoluciones</h2>
        <ul>
          <li>Puedes devolver artículos sin abrir ni usar, en su empaque sellado original, dentro de 30 días después de la entrega.</li>
          <li>Por higiene y seguridad, no aceptamos fragancias abiertas o usadas, a menos que lleguen dañadas o equivocadas.</li>
          <li>Los reembolsos se hacen a tu método de pago original en 5 a 7 días hábiles después de recibir tu devolución.</li>
        </ul>
        <h2>Artículos dañados o equivocados</h2>
        <p>
          Si tu pedido llega dañado o no es lo que pediste, escríbenos dentro de 7 días después de la entrega con tu número de pedido y una foto. Lo resolvemos
          con un reemplazo o un reembolso completo, sin costo para ti.
        </p>
        <p>
          <Link href="/es/pages/contact/">Inicia una devolución o haz una pregunta →</Link>
        </p>
      </>
    ),
  },
  faq: {
    title: "Preguntas Frecuentes",
    eyebrow: "FAQ",
    description: "Respuestas sobre autenticidad, envíos, devoluciones y tipos de fragancia en Huele Rico!: perfumes de diseñador originales por debajo del precio de tienda.",
    body: null,
  },
  "fragrance-care": {
    title: "Cuida Tu Fragancia",
    eyebrow: "Fragrance Care",
    description: "Cómo guardar y usar tu perfume para que dure más: consejos de Huele Rico!.",
    body: (
      <>
        <h2>Guárdalo bien</h2>
        <ul>
          <li>
            <strong>Guárdalo en un lugar fresco y seco.</strong> Un cajón o el clóset es mejor que el baño.
          </li>
          <li>
            <strong>Evita la luz solar directa.</strong> El sol y los cambios de temperatura descomponen los aceites de la fragancia.
          </li>
          <li>
            <strong>Mantén la tapa bien cerrada</strong> para preservar su esencia y evitar que se evapore.
          </li>
        </ul>
        <h2>Haz que dure más</h2>
        <ul>
          <li>Aplícalo sobre la piel hidratada, justo después de bañarte: la fragancia se fija mejor.</li>
          <li>Rocíalo en los puntos de pulso: cuello, muñecas, parte interna del codo y detrás de las orejas.</li>
          <li>No frotes las muñecas; eso rompe las notas de salida.</li>
          <li>Un poco en la ropa o el cabello puede hacerlo durar más. Prueba primero en la tela.</li>
        </ul>
        <p className="script">Gracias por elegir Huele Rico! Fragrances.</p>
      </>
    ),
  },
  contact: {
    title: "Contáctanos",
    eyebrow: "Contact Us",
    description: "¿Preguntas sobre un pedido, una fragancia o la autenticidad? Contacta al equipo de Huele Rico! en español o en inglés.",
    body: null,
  },
  privacy: {
    title: "Política de Privacidad",
    eyebrow: "Legal",
    description: "Cómo Huele Rico! Fragrances recopila, usa y protege tu información personal.",
    body: (
      <>
        <p className="muted">Última actualización: octubre de 2026</p>
        <p>
          {site.legalName} (“nosotros”) respeta tu privacidad. Esta política explica qué información recopilamos cuando visitas nuestro sitio o haces una
          compra, y cómo la usamos.
        </p>
        <h2>Información que recopilamos</h2>
        <ul>
          <li>
            <strong>Datos del pedido</strong>: nombre, dirección de envío y de facturación, correo, teléfono y datos de pago, que se recopilan mediante nuestro
            proveedor de pagos, Shopify.
          </li>
          <li>
            <strong>Datos del dispositivo y de uso</strong>: tipo de navegador, dirección IP, páginas vistas y sitios de referencia, mediante cookies y tecnologías
            similares.
          </li>
          <li>
            <strong>Comunicaciones</strong>: la información que nos envías por correo, el formulario de contacto o la suscripción al boletín.
          </li>
        </ul>
        <h2>Cómo la usamos</h2>
        <ul>
          <li>Para procesar y enviar tus pedidos, y comunicarnos contigo sobre ellos.</li>
          <li>Para revisar pedidos y prevenir fraudes, y mantener segura nuestra tienda.</li>
          <li>Para mejorar nuestro sitio y, con tu permiso, enviarte correos de marketing (puedes darte de baja cuando quieras).</li>
        </ul>
        <h2>Con quién la compartimos</h2>
        <p>
          Solo compartimos información con proveedores que nos ayudan a operar, como Shopify (comercio electrónico y pagos), procesadores de pago y paqueterías,
          o cuando la ley lo exige. No vendemos tu información personal.
        </p>
        <h2>Tus derechos</h2>
        <p>
          Según donde vivas, puedes tener derecho a acceder, corregir o eliminar tu información personal. Para hacer una solicitud, escribe a{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
        <h2>Contacto</h2>
        <p>
          ¿Preguntas sobre esta política? Escribe a <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </>
    ),
  },
  terms: {
    title: "Términos del Servicio",
    eyebrow: "Legal",
    description: "Términos y condiciones para comprar en Huele Rico! Fragrances.",
    body: (
      <>
        <p className="muted">Última actualización: octubre de 2026</p>
        <p>Al usar este sitio y comprar en {site.legalName}, aceptas estos términos. Léelos con atención.</p>
        <h2>Productos y precios</h2>
        <p>
          Vendemos fragancias de diseñador auténticas. El precio “de tienda” o de comparación refleja el precio sugerido por el fabricante o el precio típico en
          tienda al momento de publicarlo. Los precios y la disponibilidad pueden cambiar sin aviso. Podemos cancelar pedidos afectados por errores de precio,
          con reembolso completo.
        </p>
        <h2>Pedidos y pagos</h2>
        <p>
          Los pedidos se procesan con el pago seguro de Shopify. Podemos limitar cantidades o rechazar pedidos a nuestra discreción, incluidos los que parezcan
          ser de revendedores.
        </p>
        <h2>Envíos y devoluciones</h2>
        <p>
          Consulta nuestra <Link href="/es/pages/shipping-returns/">política de Envíos y Devoluciones</Link>.
        </p>
        <h2>Marcas registradas</h2>
        <p>
          Todos los nombres y marcas de las fragancias de diseñador que vendemos pertenecen a sus respectivos dueños. {site.legalName} es un minorista
          independiente y no está afiliado ni respaldado por esas marcas.
        </p>
        <h2>Limitación de responsabilidad</h2>
        <p>
          En la medida que lo permita la ley, nuestra responsabilidad por cualquier reclamo relacionado con un producto se limita a lo que pagaste por ese
          producto. Deja de usar cualquier producto que te cause irritación.
        </p>
        <h2>Contacto</h2>
        <p>
          ¿Preguntas? Escribe a <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </>
    ),
  },
};
