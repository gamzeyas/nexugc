export type Energy = "low" | "medium" | "high";

// Public copy: each character's voice, delivery and portrait prompt are kept private.
export type InfluencerPreset = {
  id: string;
  name: string;
  voiceName: string;
  stylePrompt: string;
  speed: number;
  gender: "female" | "male";
  vibe: string;
  description: string;
  avatarPrompt: string;
  baseEnergy: Energy;
  avatarUrl: string;
};

export const INFLUENCER_PRESETS: InfluencerPreset[] = [
  {
    "id": "zephyr",
    "name": "Zara",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "female",
    "vibe": "Enerjik & Parlak",
    "description": "Lansman ve hype içerikleri için enerjik, parlak kadın sesi.",
    "avatarPrompt": "",
    "baseEnergy": "high",
    "avatarUrl": "/avatars/zephyr.jpg"
  },
  {
    "id": "kore",
    "name": "Defne",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "female",
    "vibe": "Otoriter & Net",
    "description": "Kurumsal ve haber içerikleri için otoriter, net kadın sesi.",
    "avatarPrompt": "",
    "baseEnergy": "medium",
    "avatarUrl": "/avatars/kore.jpg"
  },
  {
    "id": "leda",
    "name": "Lina",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "female",
    "vibe": "Genç & Vlogger",
    "description": "Vlog ve günlük içerikler için genç, samimi kadın sesi.",
    "avatarPrompt": "",
    "baseEnergy": "high",
    "avatarUrl": "/avatars/leda.jpg"
  },
  {
    "id": "aoede",
    "name": "Aylin",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "female",
    "vibe": "Rahat & Bakım",
    "description": "Cilt bakımı ve wellness için rahat, sakin kadın sesi.",
    "avatarPrompt": "",
    "baseEnergy": "low",
    "avatarUrl": "/avatars/aoede.jpg"
  },
  {
    "id": "callirrhoe",
    "name": "Ceren",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "female",
    "vibe": "Samimi & Arkadaş",
    "description": "Tavsiye ve günlük yaşam için samimi, arkadaş gibi kadın sesi.",
    "avatarPrompt": "",
    "baseEnergy": "medium",
    "avatarUrl": "/avatars/callirrhoe.jpg"
  },
  {
    "id": "autonoe",
    "name": "Melis",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "female",
    "vibe": "Neşeli & Oyun",
    "description": "Oyun ve eğlence içerikleri için neşeli kadın sesi.",
    "avatarPrompt": "",
    "baseEnergy": "high",
    "avatarUrl": "/avatars/autonoe.jpg"
  },
  {
    "id": "despina",
    "name": "Sıla",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "female",
    "vibe": "Lüks & Pürüzsüz",
    "description": "Lüks ve premium markalar için sofistike kadın sesi.",
    "avatarPrompt": "",
    "baseEnergy": "low",
    "avatarUrl": "/avatars/despina.jpg"
  },
  {
    "id": "erinome",
    "name": "Eda",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "female",
    "vibe": "Bilgi & Net",
    "description": "Eğitim ve tutorial içerikleri için net, bilgilendirici kadın sesi.",
    "avatarPrompt": "",
    "baseEnergy": "medium",
    "avatarUrl": "/avatars/erinome.jpg"
  },
  {
    "id": "laomedeia",
    "name": "Lara",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "female",
    "vibe": "Canlı & İndirim",
    "description": "İndirim ve kampanya videoları için canlı, satış odaklı kadın sesi.",
    "avatarPrompt": "",
    "baseEnergy": "high",
    "avatarUrl": "/avatars/laomedeia.jpg"
  },
  {
    "id": "achernar",
    "name": "Pelin",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "female",
    "vibe": "Yumuşak & Sağlık",
    "description": "Sağlık ve mental wellness için yumuşak, güven veren kadın sesi.",
    "avatarPrompt": "",
    "baseEnergy": "low",
    "avatarUrl": "/avatars/achernar.jpg"
  },
  {
    "id": "gacrux",
    "name": "Fatma",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "female",
    "vibe": "Olgun & Güven",
    "description": "Aile ve finans için olgun, güvenilir kadın sesi.",
    "avatarPrompt": "",
    "baseEnergy": "medium",
    "avatarUrl": "/avatars/gacrux.jpg"
  },
  {
    "id": "pulcherrima",
    "name": "Beren",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "female",
    "vibe": "Atılgan & Satış",
    "description": "Direct response ve güçlü CTA için atılgan kadın sesi.",
    "avatarPrompt": "",
    "baseEnergy": "high",
    "avatarUrl": "/avatars/pulcherrima.jpg"
  },
  {
    "id": "vindemiatrix",
    "name": "İrem",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "female",
    "vibe": "Nazik & Rehber",
    "description": "Onboarding ve müşteri rehberi için nazik kadın sesi.",
    "avatarPrompt": "",
    "baseEnergy": "low",
    "avatarUrl": "/avatars/vindemiatrix.jpg"
  },
  {
    "id": "sulafat",
    "name": "Nazlı",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "female",
    "vibe": "Sıcak & Sohbet",
    "description": "Podcast ve hikaye anlatımı için sıcak, sohbet havasında kadın sesi.",
    "avatarPrompt": "",
    "baseEnergy": "medium",
    "avatarUrl": "/avatars/sulafat.jpg"
  },
  {
    "id": "puck",
    "name": "Berk",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "male",
    "vibe": "Neşeli & Hızlı",
    "description": "Tech review ve gaming içerikleri için enerjik, neşeli erkek sesi.",
    "avatarPrompt": "",
    "baseEnergy": "high",
    "avatarUrl": "/avatars/puck.jpg"
  },
  {
    "id": "charon",
    "name": "Erhan",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "male",
    "vibe": "Teknik & Düz",
    "description": "Teknik dokümantasyon ve B2B için sade, net erkek sesi.",
    "avatarPrompt": "",
    "baseEnergy": "medium",
    "avatarUrl": "/avatars/charon.jpg"
  },
  {
    "id": "fenrir",
    "name": "Tolga",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "male",
    "vibe": "Heyecanlı & Spor",
    "description": "Spor ve fitness için heyecanlı, hype erkek sesi.",
    "avatarPrompt": "",
    "baseEnergy": "high",
    "avatarUrl": "/avatars/fenrir.jpg"
  },
  {
    "id": "orus",
    "name": "Hakan",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "male",
    "vibe": "Profesyonel & B2B",
    "description": "SaaS ve enterprise için profesyonel erkek sesi.",
    "avatarPrompt": "",
    "baseEnergy": "medium",
    "avatarUrl": "/avatars/orus.jpg"
  },
  {
    "id": "enceladus",
    "name": "Kaan",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "male",
    "vibe": "Derin & Dramatik",
    "description": "Sinematik ve dramatik içerikler için derin erkek sesi.",
    "avatarPrompt": "",
    "baseEnergy": "low",
    "avatarUrl": "/avatars/enceladus.jpg"
  },
  {
    "id": "iapetus",
    "name": "Sinan",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "male",
    "vibe": "Akıcı & Kitap",
    "description": "Audiobook ve narration için akıcı, sakin erkek sesi.",
    "avatarPrompt": "",
    "baseEnergy": "low",
    "avatarUrl": "/avatars/iapetus.jpg"
  },
  {
    "id": "umbriel",
    "name": "Emre",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "male",
    "vibe": "Havalı & Sakin",
    "description": "Streetwear ve müzik için havalı, sakin erkek sesi.",
    "avatarPrompt": "",
    "baseEnergy": "low",
    "avatarUrl": "/avatars/umbriel.jpg"
  },
  {
    "id": "algenib",
    "name": "Yiğit",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "male",
    "vibe": "Karakterli & Boğuk",
    "description": "Karakterli ve indie içerikler için boğuk, karizmatik erkek sesi.",
    "avatarPrompt": "",
    "baseEnergy": "medium",
    "avatarUrl": "/avatars/algenib.jpg"
  },
  {
    "id": "algieba",
    "name": "Sarp",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "male",
    "vibe": "Karizmatik & Lüks",
    "description": "Lüks markalar için karizmatik, sofistike erkek sesi.",
    "avatarPrompt": "",
    "baseEnergy": "medium",
    "avatarUrl": "/avatars/algieba.jpg"
  },
  {
    "id": "schedar",
    "name": "Selim",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "male",
    "vibe": "Dengeli & Haber",
    "description": "Haber ve güncel içerikler için dengeli, güvenilir erkek sesi.",
    "avatarPrompt": "",
    "baseEnergy": "medium",
    "avatarUrl": "/avatars/schedar.jpg"
  },
  {
    "id": "achird",
    "name": "Mert",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "male",
    "vibe": "Samimi & Komşu",
    "description": "Günlük ürünler ve aile için samimi, komşu gibi erkek sesi.",
    "avatarPrompt": "",
    "baseEnergy": "medium",
    "avatarUrl": "/avatars/achird.jpg"
  },
  {
    "id": "zubenelgenubi",
    "name": "Doğukan",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "male",
    "vibe": "Günlük & Sokak",
    "description": "Sokak vlog ve urban içerikler için samimi, raw erkek sesi.",
    "avatarPrompt": "",
    "baseEnergy": "high",
    "avatarUrl": "/avatars/zubenelgenubi.jpg"
  },
  {
    "id": "sadachbia",
    "name": "Onur",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "male",
    "vibe": "Hayat Dolu & Etkinlik",
    "description": "Festival ve etkinlik içerikleri için hayat dolu erkek sesi.",
    "avatarPrompt": "",
    "baseEnergy": "high",
    "avatarUrl": "/avatars/sadachbia.jpg"
  },
  {
    "id": "sadaltager",
    "name": "Burak",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "male",
    "vibe": "Uzman & Analitik",
    "description": "Analitik ve uzman içerikler için ciddi, güvenilir erkek sesi.",
    "avatarPrompt": "",
    "baseEnergy": "low",
    "avatarUrl": "/avatars/sadaltager.jpg"
  },
  {
    "id": "rasalgethi",
    "name": "Cem",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "male",
    "vibe": "Sakin & Rehber",
    "description": "Tutorial ve mindfulness için sakin, rehber erkek sesi.",
    "avatarPrompt": "",
    "baseEnergy": "low",
    "avatarUrl": "/avatars/rasalgethi.jpg"
  },
  {
    "id": "alnilam",
    "name": "Demir",
    "voiceName": "",
    "stylePrompt": "",
    "speed": 1,
    "gender": "male",
    "vibe": "Güçlü & Manifesto",
    "description": "Manifesto ve marka filmleri için güçlü, sinematik erkek sesi.",
    "avatarPrompt": "",
    "baseEnergy": "high",
    "avatarUrl": "/avatars/alnilam.jpg"
  }
];

export function getPreset(id: string | null | undefined) {
  return INFLUENCER_PRESETS.find((p) => p.id === id);
}
