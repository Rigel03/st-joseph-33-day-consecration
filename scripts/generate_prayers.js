// scripts/generate_prayers.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'src', 'data');

console.log('Writing comprehensive datasets to:', dataDir);

// 1. PRAYERS DATASET
const prayers = {
  litany: {
    title: "Litany of St. Joseph",
    latinTitle: "Litaniae Sancti Ioseph",
    description: "Approved and indulgenced by St. Pope Pius X in 1909. Recited daily during the 33-day preparation.",
    items: [
      { invocation: "Lord, have mercy.", latin: "Kýrie, eléison.", response: "Lord, have mercy.", latinResponse: "Kýrie, eléison." },
      { invocation: "Christ, have mercy.", latin: "Christe, eléison.", response: "Christ, have mercy.", latinResponse: "Christe, eléison." },
      { invocation: "Lord, have mercy.", latin: "Kýrie, eléison.", response: "Lord, have mercy.", latinResponse: "Kýrie, eléison." },
      { invocation: "Christ, hear us.", latin: "Christe, audi nos.", response: "Christ, graciously hear us.", latinResponse: "Christe, exaudi nos." },
      { invocation: "God, the Father of Heaven,", latin: "Pater de caelis, Deus,", response: "have mercy on us.", latinResponse: "Miserére nobis." },
      { invocation: "God the Son, Redeemer of the world,", latin: "Fili, Redémptor mundi, Deus,", response: "have mercy on us.", latinResponse: "Miserére nobis." },
      { invocation: "God the Holy Spirit,", latin: "Spiritus Sancte, Deus,", response: "have mercy on us.", latinResponse: "Miserére nobis." },
      { invocation: "Holy Trinity, One God,", latin: "Sancta Trínitas, unus Deus,", response: "have mercy on us.", latinResponse: "Miserére nobis." },
      { invocation: "Holy Mary,", latin: "Sancta María,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Saint Joseph,", latin: "Sancte Ioseph,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Noble Offspring of David,", latin: "Proles David ínclyta,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Light of Patriarchs,", latin: "Lumen Patriarchárum,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Spouse of the Mother of God,", latin: "Dei Genetrícis Sponse,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Chaste Guardian of the Virgin,", latin: "Custos pudíce Vírginis,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Foster-Father of the Son of God,", latin: "Filii Dei nutrície,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Zealous Defender of Christ,", latin: "Christi defénsor sédule,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Head of the Holy Family,", latin: "Almae Famíliae praeses,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Joseph Most Just,", latin: "Ioseph iustíssime,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Joseph Most Chaste,", latin: "Ioseph castíssime,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Joseph Most Prudent,", latin: "Ioseph prudentíssime,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Joseph Most Courageous,", latin: "Ioseph fortissíme,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Joseph Most Obedient,", latin: "Ioseph oboedientíssime,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Joseph Most Faithful,", latin: "Ioseph fidelíssime,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Mirror of Patience,", latin: "Spéculum patiéntiae,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Lover of Poverty,", latin: "Amátor paupertátis,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Model of Workmen,", latin: "Exémplar opíficum,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Glory of Domestic Life,", latin: "Domésticae vitae decus,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Guardian of Virgins,", latin: "Custos vírginum,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Pillar of Families,", latin: "Familiárum cólumen,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Comfort of the Afflicted,", latin: "Solátium miserórum,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Hope of the Sick,", latin: "Spes aegrotántium,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Patron of the Dying,", latin: "Patróne moriéntium,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Terror of Demons,", latin: "Terror daémonum,", response: "pray for us.", latinResponse: "Ora pro nobis." },
      { invocation: "Protector of the Holy Church,", latin: "Protéctor sanctae Ecclésiae,", response: "pray for us.", latinResponse: "Ora pro nobis." }
    ],
    lambOfGod: [
      { invocation: "Lamb of God, who takes away the sins of the world,", latin: "Agnus Dei, qui tollis peccáta mundi,", response: "Spare us, O Lord.", latinResponse: "Parce nobis, Dómine." },
      { invocation: "Lamb of God, who takes away the sins of the world,", latin: "Agnus Dei, qui tollis peccáta mundi,", response: "Graciously hear us, O Lord.", latinResponse: "Exáudi nobis, Dómine." },
      { invocation: "Lamb of God, who takes away the sins of the world,", latin: "Agnus Dei, qui tollis peccáta mundi,", response: "Have mercy on us.", latinResponse: "Miserére nobis." }
    ],
    versicle: {
      v: "He has made him lord of his household,",
      latinV: "Constítuit eum dóminum domus suae.",
      r: "And prince over all his possessions.",
      latinR: "Et príncipem omnis possessiónis suae."
    },
    closingPrayer: {
      text: "Let us pray. O God, who, in your loving providence, chose Blessed Joseph to be the spouse of your most Holy Mother, grant us the favor of having him for our intercessor in heaven whom on earth we venerate as our protector. You, who live and reign forever and ever. Amen.",
      latin: "Orémus: Deus, qui in ineffábili providéntia beátum Ioseph sanctíssimae Genetrícis tuae Sponsum elígere dignátus es, praesta, quaésumus, ut quem protectórem venerámur in terris, intercessórem habére mereámur in caelis: Qui vivis et regnas in saécula saeculórum. Amen."
    }
  },
  actsOfConsecration: [
    {
      id: "calloway-long",
      title: "Act of Consecration to St. Joseph",
      author: "Fr. Donald Calloway, MIC",
      recommended: true,
      text: "On this day, before the great multitude of heavenly witnesses, I, [Name], a repentant sinner, consecrate myself, body and soul, to you, St. Joseph.\n\nI turn to you as my spiritual father and place my life and my salvation into your hands. Confident in your goodness, I place myself under your paternal cloak and ask you to protect me from the world, the flesh, and the devil.\n\nSaint Joseph, you are the virginal husband of the Mother of God! Help me to love her with tender affection and filial devotion. Mary is my spiritual mother and the surest, fastest, and easiest way to Jesus. Keep me close to her and, together with her, bring me closer to Jesus.\n\nNever depart from me, St. Joseph. Nourish me with the Bread of Life, instruct me in the wisdom of the saints, help me carry my cross, and keep me always in the Catholic Church. When I die, take me to the Kingdom of Heaven to see Jesus and Mary.\n\nFrom this day onward, I will never forget you. I will speak of you often, spend time with you in prayer and, with your help, earnestly strive to sin no more. Should I fall, help me to repent and go to Confession. Should I go astray, guide me back to the truth.\n\nBefore heaven and earth, my soul cries out: Praise to the Holy Trinity who has made you prince over all their possessions! Praise to the Virgin Mary who loves you and longs to see you loved! Praise to you, my spiritual father, the great St. Joseph!\n\nI give everything to you, St. Joseph. Take me as your own. I am yours. Amen!"
    },
    {
      id: "calloway-short",
      title: "Act of Consecration to St. Joseph (Short Form)",
      author: "Fr. Donald Calloway, MIC",
      text: "I, [Name], a child of God, take you, St. Joseph, to be my spiritual father. I am confident that Jesus and Mary have led me to you; to know you, to love you, and to be totally consecrated to you.\n\nTherefore, having come to know and love you, I consecrate myself entirely to you, St. Joseph. I want you in my life; I need you in my life. Take me as your spiritual child, O great St. Joseph! I desire to hold nothing back from your protective fatherhood.\n\nAs the husband of Mary, you provided for my spiritual mother. Thank you for always being faithful to her. Thank you for loving her and giving your entire life for her service.\n\nAs the virginal father of Jesus, you cared for my Lord and protected him from evil men. Thank you for guarding the life of my Savior. Thanks to you, Jesus was able to shed his blood for me on the Cross. Thanks to you, St. Joseph, I have hope of everlasting life in heaven.\n\nAs my spiritual father, I know that you will guide and protect me, too. Please instruct me in the ways of prayer, virtue, and holiness. I want to be like you, St. Joseph. I want to be pure, humble, loving, and merciful.\n\nNow that I am yours and you are mine, I promise never to forget you. I know that you will never forget me, and this gives me boundless joy! I am loved by St. Joseph! I belong to St. Joseph!\n\nPraise to the Holy Trinity who has blessed you and raised you to be the greatest saint after Mary. Praise to the Virgin who loves you and wants souls to love you. Praise to you, St. Joseph, my father, my guardian, and my all! Amen!"
    },
    {
      id: "eymard",
      title: "Act of Consecration by St. Peter Julian Eymard",
      author: "St. Peter Julian Eymard",
      text: "I consecrate myself to you, good St. Joseph, as my spiritual father. I choose you to rule my soul and to teach me the interior life, the life hidden away with Jesus, Mary, and yourself.\n\nAbove all, I want to imitate the humble silence with which you shrouded Jesus and Mary. For me everything lies in that — self-abnegation like our Lord in his hidden life, making the world forget me by my silence and my practice of virtue.\n\nI consecrate myself to you as my guide and model in all my duties so that I may learn to fulfill them with meekness and humility: with meekness toward my brethren, my neighbor, and all with whom I come in contact; with humility toward myself and simplicity before God.\n\nI choose you, good saint, as my counselor, my confidant, my protector in all my difficulties and trials. I do not ask to be spared crosses and sufferings, but only from self-love which might take away their value by making me vain about them.\n\nI choose you as my protector. Be my father as you were the father of the Holy Family at Nazareth. Be my guide; be my protector. I do not ask for temporal goods, greatness, or power. I ask only that I serve with fidelity and devotedness my divine King.\n\nI shall honor, love, and serve you with Mary, my mother, and never shall I separate her name from yours.\n\nO Jesus, give me Joseph for a father as you have given me Mary as a mother. Fill me with devotion, confidence, and filial love. Listen to my prayer. I know that you will. Already I feel more devout, more full of hope and confidence in good St. Joseph, your foster father and my spiritual father. Amen."
    },
    {
      id: "liguori",
      title: "Act of Consecration by St. Alphonsus Liguori",
      author: "St. Alphonsus Liguori",
      text: "O Holy Patriarch, I rejoice with you at the exalted dignity by which you were deemed worthy to act as father to Jesus, to give him orders and to be obeyed by him whom heaven and earth obey.\n\nO great saint, as you were served by God, I too wish to be taken into your service. I choose you, after Mary, to be my chief advocate and protector.\n\nI promise to honor you every day by some special act of devotion and by placing myself under your daily protection.\n\nBy that sweet company which Jesus and Mary gave you in your lifetime, protect me all through life, so that I may never separate myself from my God by losing his grace.\n\nMy dear St. Joseph, pray to Jesus for me. Certainly, he can never refuse you anything, as he obeyed all your orders while on earth. Tell him to detach me from all creatures and from myself, to inflame me with his holy love, and then to do with me what he pleases.\n\nBy that assistance which Jesus and Mary gave you at death, I beg of you to protect me in a special way at the hour of my death, so that dying assisted by you, in the company of Jesus and Mary, I may go to thank you in paradise and, in your company, to praise my God for all eternity. Amen."
    },
    {
      id: "bernardine",
      title: "Act of Consecration by St. Bernardine of Siena",
      author: "St. Bernardine of Siena",
      text: "O my beloved St. Joseph, adopt me as thy child. Take charge of my salvation; watch over me day and night; preserve me from the occasions of sin; obtain for me purity of body. Through thy intercession with Jesus, grant me a spirit of sacrifice, humility, self-denial, burning love for Jesus in the Blessed Sacrament, and a sweet and tender love for Mary, my mother. Saint Joseph, be with me living, be with me dying, and obtain for me a favorable judgment from Jesus, my merciful Savior. Amen."
    }
  ],
  devotionalPrayers: [
    {
      id: "memorare",
      title: "Memorare to St. Joseph",
      text: "Remember, O Most Chaste Spouse of the Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thy intercession was left unaided.\n\nInspired by this confidence, I fly unto you, my spiritual father, and beg your protection. O Foster Father of the Redeemer, despise not my petitions, but in your goodness hear and answer me. Amen."
    },
    {
      id: "veni-sancte-spiritus",
      title: "Veni, Sancte Spiritus (Come, Holy Spirit)",
      text: "Come, Holy Spirit, send down those beams, which sweetly flow in silent streams from Thy bright throne above.\n\nO come, Thou Father of the poor; O come, Thou source of all our store, come, fill our hearts with love.\n\nO Thou, of comforters the best, O Thou, the soul’s delightful guest, the pilgrim’s sweet relief.\n\nRest art Thou in our toil, most sweet refreshment in the noonday heat; and solace in our grief.\n\nO blessed Light of life Thou art; fill with Thy light the inmost heart of those who hope in Thee.\n\nWithout Thy Godhead nothing can, have any price or worth in man, nothing can harmless be.\n\nLord, wash our sinful stains away, refresh from heaven our barren clay, our wounds and bruises heal.\n\nTo Thy sweet yoke our stiff necks bow, warm with Thy fire our hearts of snow, our wandering feet recall.\n\nGrant to Thy faithful, dearest Lord, whose only hope is Thy sure word, the sevenfold gifts of grace.\n\nGrant us in life Thy grace that we, in peace may die and ever be, in joy before Thy face. Amen. Alleluia."
    },
    {
      id: "leo-xiii",
      title: "Prayer of Pope Leo XIII",
      subtitle: "To be prayed after the Rosary in October",
      text: "To you, O Blessed Joseph, we have recourse in our affliction, and having implored the help of your most holy spouse, we now, with hearts filled with confidence, earnestly beg you to take us under your protection. Through that sacred bond of charity which united you to the Immaculate Virgin Mother of God, and by that fatherly love with which you embraced the Child Jesus, we humbly beg you to look graciously upon the beloved inheritance which Jesus Christ purchased by his blood, and to aid us in our necessities with your power and strength.\n\nDefend, O most watchful guardian of the Holy Family, the chosen children of Jesus Christ. Keep from us, O most loving father, all blight of error and corruption. Aid us from on high, most valiant defender, in this conflict with the powers of darkness. And just as you once saved the Child Jesus from mortal danger, so now defend God’s Holy Church from the snares of the enemy and from all adversity. Shield us by your constant protection, so that, supported by your example and strengthened by your help, we may be able to live a virtuous life, die a happy death, and obtain everlasting bliss in heaven. Amen."
    },
    {
      id: "terror-of-demons",
      title: "Prayer to St. Joseph, Terror of Demons",
      text: "Saint Joseph, Terror of Demons, cast your solemn gaze upon the devil and all his minions, and protect us with your mighty staff. You fled through the night to avoid the devil’s wicked designs; now with the power of God, smite the demons as they flee from you! Grant special protection, we pray, for children, fathers, families, and the dying. By God’s grace, no demon dares approach while you are near, so we beg of you, always be near to us! Amen."
    },
    {
      id: "sleeping-st-joseph",
      title: "Prayer to the Sleeping St. Joseph",
      text: "O St. Joseph, you are a man greatly favored by the Most High. The angel of the Lord appeared to you in dreams, while you slept, to warn you and guide you as you cared for the Holy Family. You were both silent and strong, a loyal and courageous protector. Dear St. Joseph, as you rest in the Lord, confident in his absolute power and goodness, look upon me. Please take my need into your heart, dream of it, and present it to your Son [mention your request]. Help me then, good St. Joseph, to hear the voice of God, to arise, and to act with love. I praise and thank God with joy. Saint Joseph, I love you. Amen."
    },
    {
      id: "daily-calloway",
      title: "Daily Act of Consecration",
      author: "Fr. Donald Calloway, MIC",
      text: "Saint Joseph, spouse of Mary, virginal father of Jesus, and my spiritual father, I consecrate myself entirely to you. I lovingly embrace your fatherhood and take refuge under your paternal cloak. Help me to pray and be virtuous today. Instruct me in the wisdom of the saints, protect me from the snares of the enemy, and keep me from sinning. Should I take my last breath today, be by my side, and take me to heaven to be with Jesus and Mary. Amen."
    },
    {
      id: "holy-cloak-novena",
      title: "Prayer of the Holy Cloak Novena",
      text: "O Glorious Patriarch St. Joseph, you who were chosen by God above all men to be the earthly head of the most holy of families, I beseech you to accept me within the folds of your holy cloak, that you may become the guardian and custodian of my soul.\n\nFrom this moment on, I choose you as my father, my protector, my counselor, my patron, and I beseech you to place in your custody my body, my soul, all that I am, all that I possess, my life, and my death.\n\nLook upon me as one of your children; defend me from the treachery of my enemies, invisible or otherwise, assist me at all times in all my necessities; console me in the bitterness of my life, and especially at the hour of my death. Say but one word for me to the Divine Redeemer whom you were deemed worthy to hold in your arms, and to the Blessed Virgin Mary, your most chaste spouse. Request for me those blessings which will lead me to salvation. Include me amongst those who are most dear to you and I shall set forth to prove myself worthy of your special patronage. Amen."
    },
    {
      id: "pius-x-worker",
      title: "Prayer of St. Pope Pius X to St. Joseph the Worker",
      author: "St. Pope Pius X",
      text: "O glorious St. Joseph, model of all who labor, obtain for me the grace to work in the spirit of penance in expiation for my numberless sins; preferring devotion to duty to my inclinations; to work with joy and gratitude, regarding it as an honor to develop and employ by work the gifts which I have received from God; to work with order, peace, patience, and moderation, without ever recoiling before weariness and difficulties; to work, especially, with a pure intention and detached from myself, ever having death before my eyes and the account which I must give for time lost, for talents unused, for good omitted, and for vain satisfaction in success, so fatal to the work of God. Amen."
    },
    {
      id: "john-xxiii",
      title: "Prayer of St. Pope John XXIII",
      author: "St. Pope John XXIII",
      text: "O St. Joseph, guardian of Jesus, chaste spouse of Mary, you who passed your life in the perfect fulfillment of duty, sustaining the Holy Family of Nazareth with the work of your hands, kindly keep those who with total trust now come to you. You know their aspirations, their miseries, and their hopes. They come to you because they know that you understand and protect them. You, too, have known trial, toil, and weariness. But even in the midst of worries about the material life, your soul was filled with profound peace, and it exulted in unerring joy through intimacy with the Son of God Who was entrusted to you, and with Mary, his most sweet mother. May those whom you protect understand they are not alone in their toil, but show them how to discover Jesus at their side, to receive him with grace, to guard him faithfully, as you have done. And with your prayers obtain that in every family, in every factory, in every workshop, wherever a Christian works, all may be satisfied in charity, in patience, in justice, in seeking righteousness, so that abundant gifts may shower upon them from heaven. Amen."
    },
    {
      id: "francis-de-sales",
      title: "Prayer of St. Francis de Sales",
      author: "St. Francis de Sales",
      text: "Glorious St. Joseph, spouse of the Virgin Mary, we beseech you through the Heart of Jesus Christ, grant to us your fatherly protection.\n\nO you whose power reaches all our necessities and who knows how to make possible the most impossible things, open your fatherly eyes to the needs of your children. In the confusion and pain which press upon us, we have recourse to you with confidence.\n\nDeign to take beneath your charitable guidance this important and difficult affair, the cause of our worries, and make that its happy outcome serve for the glory of God and the good of his devoted servants. Amen."
    },
    {
      id: "john-paul-ii-march19",
      title: "Prayer of St. John Paul II for the Solemnity of St. Joseph",
      author: "St. John Paul II",
      text: "St. Joseph, Spouse of the Virgin Mother of God, teach us unceasingly all the divine truth and all the human dignity contained in the vocation of spouses and parents!\n\nSt. Joseph, obtain from God that we may cooperate, with constancy, with the grace of the great sacrament in which man and woman promise each other love, fidelity, and conjugal integrity till death!\n\nSt. Joseph, man of justice, teach us responsible love towards those whom God entrusts to us in a special way: love between spouses and love between parents and those to whom they give life! Teach us responsibility towards every life, from the first moment of its conception to its last instant on this earth. Teach us a great respect for the gift of life. Teach us to adore deeply the Creator, Father, and Giver of life.\n\nSt. Joseph, Patron of human work, assist us in all work, in that vocation of man on earth. Teach us to resolve the difficult problems connected with work in the life of each generation, beginning with the young, and in the life of society.\n\nSt. Joseph, Protector of the Church, today, on your solemnity, we pray to God with these words: “Almighty God, who chose to entrust the beginnings of our redemption to the loving care of St. Joseph, by his intercession grant that your Church may cooperate faithfully in the fulfillment of the work of salvation.” Amen."
    },
    {
      id: "purity-calloway",
      title: "Prayer to St. Joseph for Purity",
      author: "Fr. Donald Calloway, MIC",
      text: "Saint Joseph, strong spiritual father, defend me against sins of the flesh. Jesus said: “Blessed are the pure of heart, for they shall see God.” Saint Joseph, Terror of Demons, protect me from lust, immoral desires in my heart, and impure actions in my body. Help me not to offend God. Here and now, I chain myself to you and sacrifice everything for the good, the true, and the beautiful. I love you, St. Joseph, and I thank you for being my spiritual father. Amen."
    },
    {
      id: "praises-john-eudes",
      title: "Praises of St. Joseph",
      author: "St. John Eudes",
      text: "Hail Joseph, image of God the Father.\nHail Joseph, father of God the Son.\nHail Joseph, temple of the Holy Spirit.\nHail Joseph, beloved of the Most Holy Trinity.\nHail Joseph, most faithful coadjutor of the great counsel.\nHail Joseph, most worthy spouse of the Virgin Mary.\nHail Joseph, father of all the faithful.\nHail Joseph, guardian of all those who have embraced holy virginity.\nHail Joseph, faithful observer of holy silence.\nHail Joseph, lover of holy poverty.\nHail Joseph, model of meekness and patience.\nHail Joseph, mirror of humility and obedience.\nBlessed art thou above all men.\nBlessed thine eyes, which have seen the things which thou hast seen.\nBlessed thine ears, which have heard the things which thou hast heard.\nBlessed thy hands, which have touched and handled the Incarnate Word.\nBlessed thine arms, which have borne him who bears all things.\nBlessed thy bosom, on which the Son of God fondly rested.\nBlessed thy heart, inflamed with burning love.\nBlessed be the Eternal Father, who chose thee.\nBlessed be the Son, who loved thee.\nBlessed be the Holy Spirit, who sanctified thee.\nBlessed be Mary, thy spouse, who cherished thee as her spouse and brother.\nBlessed be the angel who served thee as a guardian,\nAnd blessed forever be all who love and bless thee. Amen."
    },
    {
      id: "seven-sorrows-joys",
      title: "The Seven Sorrows and Seven Joys of St. Joseph",
      author: "Traditional (Seven Sundays Devotion)",
      text: "1st Sunday:\n• Sorrow: Saint Joseph Resolves to Leave Mary Quietly (Mt 1:19)\n• Joy: Saint Joseph’s Annunciation (Mt 1:20)\n\n2nd Sunday:\n• Sorrow: The Poverty of Jesus’ Birth (Lk 2:7)\n• Joy: The Birth of the Savior (Lk 2:10-11)\n\n3rd Sunday:\n• Sorrow: The Circumcision (Lk 2:21)\n• Joy: The Holy Name of Jesus (Mt 1:25)\n\n4th Sunday:\n• Sorrow: The Prophecy of Simeon (Lk 2:34)\n• Joy: The Effects of the Redemption (Lk 2:38)\n\n5th Sunday:\n• Sorrow: The Flight into Egypt (Mt 2:14)\n• Joy: The Overthrow of the Idols of Egypt (Is 19:1)\n\n6th Sunday:\n• Sorrow: The Return from Egypt (Mt 2:22)\n• Joy: Life with Jesus and Mary at Nazareth (Lk 2:39)\n\n7th Sunday:\n• Sorrow: The Loss of the Child Jesus (Lk 2:45)\n• Joy: The Finding of the Child Jesus (Lk 2:46)"
    }
  ]
};

fs.writeFileSync(path.join(dataDir, 'prayers.json'), JSON.stringify(prayers, null, 2));
console.log('Saved prayers.json successfully');
