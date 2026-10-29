import { formatTry, PLANS } from "./pricing";

/**
 * Legal pages. They only state how the service actually works; clauses that need legal wording
 * (withdrawal, liability, legal basis) are for a lawyer to add, never drafted here.
 */

type Text = readonly [tr: string, en: string];
export type LegalSection = { heading: Text; body: Text[] };
export type LegalDoc = { title: Text; sections: LegalSection[] };

const packList: Text[] = PLANS.map((p) => [
  `${p.name}: ${p.credits} kredi, ${formatTry(p.priceTry)}${p.intro ? " (ilk alıma özel, bir kez alınabilir)" : ""}`,
  `${p.nameEn}: ${p.credits} credits, ${formatTry(p.priceTry)}${p.intro ? " (first purchase only, once)" : ""}`,
]);

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  "mesafeli-satis-sozlesmesi": {
    title: ["Mesafeli satış sözleşmesi", "Distance sales agreement"],
    sections: [
      {
        heading: ["Alıcı", "Buyer"],
        body: [["NexUGC hesabıyla kredi paketi satın alan kişi.", "The person who buys a credit pack with a NexUGC account."]],
      },
      {
        heading: ["Sözleşmenin konusu", "Subject"],
        body: [
          [
            "NexUGC'de video üretmek için kullanılan dijital kredi paketlerinin satışı. Krediler video süresine göre harcanır.",
            "The sale of digital credit packs used to make videos on NexUGC. Credits are spent by video length.",
          ],
          ...packList,
        ],
      },
      {
        heading: ["Ödeme ve teslimat", "Payment and delivery"],
        body: [
          [
            "Ödeme Shopier üzerinden kredi kartıyla alınır. Ödeme tamamlanınca krediler alıcının NexUGC hesabına yüklenir; fiziksel teslimat yoktur.",
            "Payment is taken by card through Shopier. Once it completes, the credits are added to the buyer's NexUGC account; nothing is shipped.",
          ],
        ],
      },
    ],
  },
  "iade-ve-iptal": {
    title: ["İade ve iptal", "Refunds and cancellation"],
    sections: [
      {
        heading: ["Başarısız üretim", "Failed generations"],
        body: [
          [
            "Kredi, video üretimi başlarken ayrılır. Üretim teknik bir hatayla tamamlanmazsa ayrılan kredi otomatik olarak bakiyene geri döner.",
            "Credits are set aside when a video starts. If it fails for a technical reason, they go back to your balance automatically.",
          ],
        ],
      },
      {
        heading: ["Harcanmış kredi", "Spent credits"],
        body: [["Tamamlanan videolar için harcanan kredi iade edilmez.", "Credits spent on completed videos are not refunded."]],
      },
    ],
  },
  "kvkk-aydinlatma-metni": {
    title: ["KVKK aydınlatma metni", "KVKK privacy notice"],
    sections: [
      {
        heading: ["İşlenen veriler", "Data we process"],
        body: [
          ["E-posta adresi ve hesap bilgileri", "Email address and account details"],
          ["Yüklediğin ürün fotoğrafları, yazdığın senaryolar ve üretilen videolar", "Product photos you upload, scripts you write and the videos made from them"],
          ["Sipariş numarası, paket, tutar ve Shopier'de kullandığın e-posta", "Order number, pack, amount and the email you used on Shopier"],
        ],
      },
      {
        heading: ["İşleme amaçları", "Why we process it"],
        body: [
          ["Hesabını açmak ve giriş yapmanı sağlamak", "To create your account and sign you in"],
          ["İstediğin videoları üretmek ve sana göstermek", "To make the videos you ask for and show them to you"],
          ["Ödemeni hesabına kredi olarak yüklemek", "To add your payment to your account as credits"],
        ],
      },
    ],
  },
  "gizlilik-politikasi": {
    title: ["Gizlilik politikası", "Privacy policy"],
    sections: [
      {
        heading: ["Topladığımız bilgiler", "What we collect"],
        body: [
          ["E-posta adresin ve hesap bilgilerin", "Your email address and account details"],
          ["Yüklediğin ürün fotoğrafları, senaryoların ve ürettiğin videolar", "Product photos you upload, your scripts and the videos you make"],
          ["Siparişlerinle ilgili kayıtlar (sipariş numarası, paket, tutar)", "Records of your orders (order number, pack, amount)"],
        ],
      },
      {
        heading: ["Tarayıcında sakladıklarımız", "What we keep in your browser"],
        body: [
          ["Dil tercihin ve giriş oturumun tarayıcının yerel depolamasında tutulur.", "Your language choice and sign-in session are kept in your browser's local storage."],
        ],
      },
    ],
  },
  "kullanim-kosullari": {
    title: ["Kullanım koşulları", "Terms of use"],
    sections: [
      {
        heading: ["Hizmet", "The service"],
        body: [
          [
            "NexUGC, yüklediğin ürün fotoğrafı ve yazdığın senaryoyla yapay zeka karakterlerin konuştuğu dikey videolar üretir. Karakterler gerçek kişiler değildir.",
            "NexUGC makes vertical videos in which AI characters present your product photo and say your script. The characters are not real people.",
          ],
        ],
      },
      {
        heading: ["Senin sorumlulukların", "Your responsibilities"],
        body: [
          ["Yalnızca kullanma hakkın olan ürün fotoğraflarını yükle.", "Only upload product photos you have the right to use."],
          [
            "Videolarda kanıtlanmamış bir iddia belirtme; bu Meta kurallarına takılabilir.",
            "Don't make unproven claims in your videos; they can break Meta's rules.",
          ],
          ["Gerçek kişilerin adını veya kimliğini kullanma.", "Don't use real people's names or identities."],
        ],
      },
    ],
  },
};
