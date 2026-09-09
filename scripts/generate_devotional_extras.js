// scripts/generate_devotional_extras.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'src', 'data');

const devotionalExtras = {
  dailyQuotesAndFacts: [
    {
      day: 1,
      quote: "When God wishes to raise a soul to greater heights, he unites it to St. Joseph by giving it a strong love for the good saint.",
      author: "St. Peter Julian Eymard",
      fact: "Saint Joseph's name in Hebrew means 'May he add / increase'. He is known spiritually as 'The Increaser' because he increases the life of Christ within our souls."
    },
    {
      day: 2,
      quote: "Knowing by experience St. Joseph’s astonishing influence with God, I would wish to persuade everyone to honor him with particular devotion.",
      author: "St. Teresa of Avila",
      fact: "The Litany of St. Joseph dates back to at least the 16th century and was officially approved and indulgenced by Pope St. Pius X in 1909."
    },
    {
      day: 3,
      quote: "Our heavenly Father has had only one saint to represent him on earth. Hence he bestowed everything he could on that favored saint.",
      author: "St. Peter Julian Eymard",
      fact: "Saint Joseph is the only man on earth whom Jesus Christ, the Son of God, ever called 'Father' and obeyed in his sacred humanity."
    },
    {
      day: 4,
      quote: "To Jesus through Mary and Joseph! Jesus wants you to know and love his mother and his father.",
      author: "Fr. Donald Calloway, MIC",
      fact: "Devotion to St. Joseph has flourished exponentially in the modern era: the Church has done more to promote St. Joseph in the last 150 years than in the previous 1,800 years."
    },
    {
      day: 5,
      quote: "How great his [St. Joseph’s] union with God, how sublime his gift of prayer, how wonderful the direction of the Holy Spirit!",
      author: "Blessed William Joseph Chaminade",
      fact: "Saint Joseph's docility to the Holy Spirit was so profound that God communicated to him through dreams on four momentous occasions."
    },
    {
      day: 6,
      quote: "He [St. Joseph] is head of the Holy Family, father of the trinity on earth which resembles so closely the Holy Trinity on high.",
      author: "St. Peter Julian Eymard",
      fact: "Saints throughout history have referred to Jesus, Mary, and Joseph as the 'Earthly Trinity', reflecting the life, communion, and charity of the Heavenly Trinity."
    },
    {
      day: 7,
      quote: "All Christians belong to St. Joseph because Jesus and Mary belonged to him.",
      author: "St. Leonard of Port Maurice",
      fact: "Saint Joseph is known as the First Knight of Our Lady; he consecrated his life to honor, protect, and cherish the Blessed Virgin Mary."
    },
    {
      day: 8,
      quote: "With the exception of our loving Mother, St. Joseph stands above all the saints.",
      author: "St. Maximilian Kolbe",
      fact: "Catholic theology distinguishes protodulia ('first veneration') as the unique honor given to St. Joseph, elevated above all angels and saints, second only to Mary (hyperdulia)."
    },
    {
      day: 9,
      quote: "He [God] saw to it that Joseph be born of the royal family; He wanted him to be noble even with earthly nobility.",
      author: "St. Peter Julian Eymard",
      fact: "Saint Joseph is the only person in the New Testament besides Jesus Christ who is directly addressed as 'Son of David' (by the Angel in Mt 1:20)."
    },
    {
      day: 10,
      quote: "Saint Joseph is the perfect reflection of the Father of Lights, and he helps us to receive the light of Christ.",
      author: "Fr. Donald Calloway, MIC",
      fact: "In the Latin Litany, St. Joseph is invoked as 'Lumen Patriarchárum' (Light of Patriarchs). Demons flee from his luminous reflection of God the Father."
    },
    {
      day: 11,
      quote: "How hard he must have prayed to come to know and ever increase in love toward his immaculate wife.",
      author: "Blessed Gabriele Allegra",
      fact: "Venerable Fulton Sheen and St. Josemaría Escrivá emphasized that St. Joseph was not a feeble old man, but a strong, virile, and chaste youth in the prime of his life."
    },
    {
      day: 12,
      quote: "It was necessary that divine Providence should commit her [Mary] to the charge and guardianship of a man absolutely pure.",
      author: "St. Francis de Sales",
      fact: "The liturgical Feast of the Holy Spouses (celebrating the marriage of Mary and Joseph) has been celebrated on January 23 since the 15th century."
    },
    {
      day: 13,
      quote: "In Latin, the title given to St. Joseph to signify his role as foster father is Filii Dei Nutricie: 'Nurturer of the Son of God.'",
      author: "Fr. Donald Calloway, MIC",
      fact: "Saint Joseph’s spiritual fatherhood is eternal; Jesus continues to love and honor St. Joseph as his earthly father in paradise."
    },
    {
      day: 14,
      quote: "Who saved the life of Jesus? It was Joseph... he alone is the savior of his Savior.",
      author: "Blessed William Joseph Chaminade",
      fact: "In 1940, Catholic priests imprisoned by the Nazis in Dachau consecrated themselves to St. Joseph, credited him with their survival, and built a thanksgiving museum in Kalisz, Poland."
    },
    {
      day: 15,
      quote: "Jesus and Mary not only bent their wills to Joseph’s, for he was head of the Holy Family, but they lovingly surrendered their hearts to him as well.",
      author: "St. Peter Julian Eymard",
      fact: "The Holy House of Loreto in Italy is the actual stone home of Nazareth where the Holy Family lived, venerated by over 50 popes and countless saints."
    },
    {
      day: 16,
      quote: "The Gospel describes St. Joseph as a Just Man. No greater praise of virtue and no higher tribute to merit could be applied to a man.",
      author: "St. Pope Paul VI",
      fact: "The Reverence Theory holds that Joseph resolved to separate quietly not out of suspicion of Mary, but out of holy awe and feeling unworthy before the divine mystery in her womb."
    },
    {
      day: 17,
      quote: "The heart of St. Joseph is the heart of a loving father, and you have access to his heart. The Chaste Heart of St. Joseph is your home.",
      author: "Fr. Donald Calloway, MIC",
      fact: "The Santo Anello (Holy Ring) given by St. Joseph to Mary on their wedding day is preserved today in the Cathedral of San Lorenzo in Perugia, Italy."
    },
    {
      day: 18,
      quote: "What prudence was required to educate a God become a child, who willed to obey him for thirty years!",
      author: "Blessed William Joseph Chaminade",
      fact: "The Seven Sundays devotion commemorates the Seven Sorrows and Seven Joys of St. Joseph on the seven weeks leading up to March 19."
    },
    {
      day: 19,
      quote: "All I know, sweetie, is old men don't walk to Egypt!",
      author: "Mother Angelica",
      fact: "The journey from Nazareth to Egypt and back was over 200 miles across treacherous deserts, proving St. Joseph's youthful vigor and steadfast fortitude."
    },
    {
      day: 20,
      quote: "He who sleeps well, lives well. He who sleeps, prays.",
      author: "Charles Péguy",
      fact: "Pope Francis keeps a statue of 'Sleeping St. Joseph' on his desk and slips slips of paper with urgent prayer intentions beneath it at night."
    },
    {
      day: 21,
      quote: "The Church admires the simplicity and the depth of his faith.",
      author: "St. John Paul II",
      fact: "For 30 hidden years in Nazareth, St. Joseph practiced perpetual adoration, gazing daily upon the Incarnate God in his home and workshop."
    },
    {
      day: 22,
      quote: "He [St. Joseph] was always imperturbable, even in adversities. Let us model ourselves after this sublime example.",
      author: "St. Joseph Marello",
      fact: "Pope St. John XXIII inserted St. Joseph's name into the Roman Canon (Eucharistic Prayer I) in 1962 during the Second Vatican Council."
    },
    {
      day: 23,
      quote: "Truly, I doubt not that the angels came thronging to that poor workshop to admire the humility of him who guarded that divine child.",
      author: "St. Francis de Sales",
      fact: "At the Presentation in the Temple, St. Joseph offered two turtledoves—the offering prescribed by Mosaic Law specifically for the poorest families."
    },
    {
      day: 24,
      quote: "At the workbench where he plied his trade together with Jesus, Joseph brought human work closer to the mystery of the Redemption.",
      author: "St. John Paul II",
      fact: "In 1955, Pope Pius XII instituted the feast of St. Joseph the Worker on May 1 to restore Christian meaning and dignity to human labor."
    },
    {
      day: 25,
      quote: "Joseph loved Jesus as a father loves his son and showed his love by giving him the best he had.",
      author: "St. Josemaría Escrivá",
      fact: "Jesus spent 90% of his earthly life (30 out of 33 years) living under the quiet domestic roof and fatherly care of St. Joseph in Nazareth."
    },
    {
      day: 26,
      quote: "O Saint Joseph, father and protector of virgins. It seemed to me that I was well protected and completely sheltered from every danger.",
      author: "St. Thérèse of Lisieux",
      fact: "In 1878, a mysterious carpenter built the miraculous spiral staircase in the Loretto Chapel in Santa Fe, NM, with no central support, nails, or local timber."
    },
    {
      day: 27,
      quote: "The Gospel does not record a single word from him; his language is silence.",
      author: "St. Pope Paul VI",
      fact: "In 1660, St. Joseph appeared to shepherd Gaspard Ricard in Cotignac, France, causing a miraculous freshwater spring to gush forth from beneath a massive rock."
    },
    {
      day: 28,
      quote: "Nothing will be refused him, neither by Our Lady nor by his glorious Son.",
      author: "St. Francis de Sales",
      fact: "Wednesday is the day of the week traditionally consecrated to honoring St. Joseph throughout Catholic history, and March is his dedicated month."
    },
    {
      day: 29,
      quote: "As the Church’s Liturgy teaches, he cooperated in the fullness of time in the great mystery of salvation and is truly a minister of salvation.",
      author: "St. John Paul II",
      fact: "Both St. Teresa of Avila and infant St. Thérèse of Lisieux attributed miraculous recoveries from near-fatal illnesses to the intercession of St. Joseph."
    },
    {
      day: 30,
      quote: "The name of Joseph will be our protection during all the days of our life, but above all at the moment of death.",
      author: "Blessed William Joseph Chaminade",
      fact: "Saint Joseph is the Patron of a Happy Death because he died peacefully in the arms of Jesus and the Blessed Virgin Mary."
    },
    {
      day: 31,
      quote: "Saint Joseph is most powerful against the demons which fight against us.",
      author: "St. Alphonsus Liguori",
      fact: "Blessed Bartolo Longo, a former ordained satanic priest who became a Third Order Dominican, attributed his deliverance and crusade for souls to St. Joseph, Terror of Demons."
    },
    {
      day: 32,
      quote: "He [St. Joseph] was head of the divine household on earth with fatherly authority; he has the Church dedicated to his protection.",
      author: "Pope Leo XIII",
      fact: "On December 8, 1870, Blessed Pope Pius IX officially declared St. Joseph the 'Patron of the Universal Church' with the decree Quemadmodum Deus."
    },
    {
      day: 33,
      quote: "He made him the lord and chief of his household and possessions, the guardian of his choicest treasures.",
      author: "Blessed Pope Pius IX",
      fact: "By making this 33-day consecration, you entrust yourself filial-wise into the hands of the guardian of the Redeemer and become an 'apparition of St. Joseph' in the world."
    }
  ],
  consecrationSchedule: [
    { start: "December 22", feastDay: "Feast of the Holy Spouses", consecrationDay: "January 23" },
    { start: "January 1", feastDay: "Presentation of the Lord", consecrationDay: "February 2" },
    { start: "February 15 (Feb 16 leap)", feastDay: "Solemnity of St. Joseph", consecrationDay: "March 19" },
    { start: "March 30", feastDay: "St. Joseph the Worker", consecrationDay: "May 1" },
    { start: "April 11", feastDay: "Our Lady of Fatima", consecrationDay: "May 13" },
    { start: "July 20", feastDay: "Our Lady of Knock", consecrationDay: "August 21" },
    { start: "September 30", feastDay: "All Saints", consecrationDay: "November 1" },
    { start: "November 8", feastDay: "Our Lady of Loreto", consecrationDay: "December 10" },
    { start: "Late November", feastDay: "Solemnity of the Holy Family", consecrationDay: "Late December (1st Sun after Christmas)" }
  ],
  titlesOfStJoseph: [
    { title: "Noble Offspring of David", meaning: "Legal heir to the throne of King David, fulfilling messianic prophecy for Jesus Christ." },
    { title: "Light of Patriarchs", meaning: "Crown and summit of all Old Testament fathers, excelling in faith, obedience, and hope." },
    { title: "Spouse of the Mother of God", meaning: "True husband of the Blessed Virgin Mary, united in pure conjugal and virginal love." },
    { title: "Chaste Guardian of the Virgin", meaning: "Defender of Mary's perpetual virginity and custodian of the new Ark of the Covenant." },
    { title: "Foster-Father of the Son of God", meaning: "Filii Dei Nutricie: the loving nurturer and legal father of the Incarnate Word." },
    { title: "Zealous Defender of Christ", meaning: "Courageous watchman who saved the Child Jesus from Herod and guided the Holy Family in exile." },
    { title: "Head of the Holy Family", meaning: "Loving paterfamilias to whom the King of Kings and Queen of Heaven submitted with filial reverence." },
    { title: "Joseph Most Just", meaning: "Living model of uprightness, fidelity to God's commandments, and reverent awe before divine mystery." },
    { title: "Joseph Most Chaste", meaning: "Purest gentleman possessing complete mastery over passions and burning love for God." },
    { title: "Joseph Most Prudent", meaning: "Charioteer of virtues guided by supernatural prudence and docility to the Holy Spirit." },
    { title: "Joseph Most Courageous", meaning: "Stouthearted protector unafraid of danger, exile, robbers, poverty, or spiritual combat." },
    { title: "Joseph Most Obedient", meaning: "Prompt collaborator with God's directives, rising in the night without hesitation to do God's will." },
    { title: "Joseph Most Faithful", meaning: "Steadfast companion in times of trial, doubt, poverty, and adversity." },
    { title: "Mirror of Patience", meaning: "Imperturbable serenity in all trials, long journeys, and unfulfilled earthly expectations." },
    { title: "Lover of Poverty", meaning: "Detached from worldly riches, content with humble labor, and completely abandoned to Divine Providence." },
    { title: "Model of Workmen", meaning: "Sanctifier of daily manual labor, teaching the Creator of the Universe the trade of carpentry." },
    { title: "Glory of Domestic Life", meaning: "Sanctifier of ordinary family routines, domestic harmony, meals, and family prayer." },
    { title: "Guardian of Virgins", meaning: "Fatherly protector of consecrated souls, religious sisters, and those who preserve pure chastity." },
    { title: "Pillar of Families", meaning: "Firm bedrock of godly fatherhood, sacrificial headship, and marital fidelity." },
    { title: "Comfort of the Afflicted", meaning: "Tender solace to the miserable, lonely, burdened, and anxious." },
    { title: "Hope of the Sick", meaning: "Intercessor for physical healing, miraculous restoration, and patient suffering." },
    { title: "Patron of the Dying", meaning: "Companion at the hour of death, having died in the comforting presence of Jesus and Mary." },
    { title: "Terror of Demons", meaning: "Spiritual dragon-slayer whose purity, humility, and fatherly authority rout the forces of hell." },
    { title: "Protector of the Holy Church", meaning: "Guardian of the Mystical Body of Christ across all continents and centuries." }
  ],
  biblicalReferences: [
    {
      passage: "Matthew 1:16-25",
      title: "The Genealogy and Annunciation to Joseph",
      summary: "Joseph's Davidic lineage; his reverent hesitation upon learning Mary is with child; the angel's command in a dream; his instant obedience."
    },
    {
      passage: "Luke 2:1-7",
      title: "The Journey to Bethlehem and Birth of Jesus",
      summary: "Joseph escorts Mary to Bethlehem for the census; shelters her in the manger when no room was found; witnesses the newborn Savior."
    },
    {
      passage: "Luke 2:21-39",
      title: "Circumcision and Presentation in the Temple",
      summary: "Joseph names the Child Jesus; presents the poor man's offering of two turtledoves; hears Simeon's prophecy of the sword and contradition."
    },
    {
      passage: "Matthew 2:13-15",
      title: "Flight into Egypt",
      summary: "The angel commands Joseph in a dream to take Jesus and Mary to Egypt to escape Herod's massacre; Joseph departs by night."
    },
    {
      passage: "Matthew 2:19-23",
      title: "The Return to Nazareth",
      summary: "After Herod dies, the angel directs Joseph to return; warned again, he withdraws to Galilee and settles his family in Nazareth."
    },
    {
      passage: "Luke 2:41-52",
      title: "Finding Jesus in the Temple",
      summary: "After three days of anxious searching, Joseph and Mary find 12-year-old Jesus in the Temple; Jesus returns to Nazareth and remains obedient to them."
    },
    {
      passage: "John 1:45 & 6:42",
      title: "Jesus Known as the Son of Joseph",
      summary: "Philip tells Nathanael: 'We have found him of whom Moses and the prophets wrote: Jesus of Nazareth, the son of Joseph.'"
    }
  ],
  shrines: [
    { name: "St. Joseph’s Oratory", location: "Montréal, Canada", description: "Founded by St. André Bessette in 1904, dedicated as a minor basilica in 1967. The largest shrine dedicated to St. Joseph in the world, receiving over 2 million pilgrims annually." },
    { name: "The Holy House of Loreto", location: "Loreto, Italy", description: "The original stone home of the Holy Family in Nazareth, transported by angels in the 13th century, encased in marble, and visited by over 50 popes and countless saints." },
    { name: "Church of St. Joseph (St. Joseph's Workshop)", location: "Nazareth, Israel", description: "Built over the traditional site of St. Joseph's home and carpentry workshop, near the Basilica of the Annunciation." },
    { name: "Basilica di San Giuseppe al Trionfale", location: "Rome, Italy", description: "Minor basilica founded by St. Luigi Guanella with Pope St. Pius X's encouragement; international headquarters of the Pious Union of St. Joseph for the Dying." },
    { name: "Sanctuary of St. Joseph", location: "Kalisz, Poland", description: "Poland's primary center of St. Joseph devotion since 1673. Houses the miraculous image and the WW2 concentration camp survivors' thanksgiving museum." },
    { name: "Miraculous Staircase of Loretto Chapel", location: "Santa Fe, New Mexico, USA", description: "Built in 1878 by an unknown carpenter following a 9-day novena to St. Joseph; a 33-step spiral staircase without center support or nails." },
    { name: "Sanctuary of St. Joseph", location: "Cotignac, France", description: "Site where St. Joseph appeared to shepherd Gaspard Ricard in 1660, producing a miraculous freshwater spring. Led King Louis XIV to consecrate France to St. Joseph." },
    { name: "Real Santuario de San José de la Montaña", location: "Barcelona, Spain", description: "Founded in the late 19th century by Blessed Petra of St. Joseph, who was acclaimed by St. John Paul II as the 'Apostle of St. Joseph of the 19th century.'" },
    { name: "National Shrine of St. Joseph", location: "De Pere, Wisconsin, USA", description: "Crowned by Pope Leo XIII in 1892; home to a perpetual novena to St. Joseph that has been prayed continuously since 1888." },
    { name: "National Shrine of St. Joseph", location: "Cebu, Philippines", description: "Official national center of devotion to St. Joseph in the Philippines, solemnly declared in 2001." }
  ],
  championsOfStJoseph: [
    { name: "St. Bernardine of Siena", century: "15th Century", note: "Great Franciscan preacher who championed the preeminence and bodily assumption of St. Joseph." },
    { name: "St. Lawrence of Brindisi", century: "16th Century", note: "Doctor of the Church who systematically proved St. Joseph's exalted place in heaven following Jesus and Mary." },
    { name: "St. Teresa of Avila", century: "16th Century", note: "Carmelite reformer healed by St. Joseph who challenged all souls to test the unlimited efficacy of his intercession." },
    { name: "St. Francis de Sales", century: "17th Century", note: "Doctor of the Church who exalted St. Joseph's purity, supernatural prudence, and bodily glorification." },
    { name: "Venerable Mary of Ágreda", century: "17th Century", note: "Spanish mystic and author of The Mystical City of God who revealed the seven privileges of devotion to St. Joseph." },
    { name: "St. Alphonsus Liguori", century: "18th Century", note: "Doctor of the Church who taught that God refuses no grace asked through St. Joseph, who saved his Savior from Herod." },
    { name: "Blessed William Joseph Chaminade", century: "19th Century", note: "Founder of the Marianists who preached fervently on St. Joseph as 'Savior of the Savior' and model father." },
    { name: "St. Peter Julian Eymard", century: "19th Century", note: "Apostle of the Eucharist who called St. Joseph the 'First Adorer' and wrote The Month of St. Joseph." },
    { name: "Blessed Jean-Joseph Lataste", century: "19th Century", note: "Dominican priest who offered his life as a sacrifice so that Pope Pius IX would declare St. Joseph Patron of the Church." },
    { name: "St. Luigi Guanella", century: "20th Century", note: "Founded the Pious Union of St. Joseph for the suffering and dying with the personal backing of St. Pope Pius X." },
    { name: "St. André Bessette", century: "20th Century", note: "Humble Holy Cross porter who built St. Joseph's Oratory in Montreal and channeled countless healing miracles." },
    { name: "Venerable Fulton J. Sheen", century: "20th Century", note: "Articulated the theological brilliance of St. Joseph as a strong, youthful, and virile guardian of Mary." },
    { name: "St. Josemaría Escrivá", century: "20th Century", note: "Founder of Opus Dei whose famous homily 'In Joseph's Workshop' sanctified ordinary daily labor and family life." },
    { name: "Blessed Pope Pius IX", century: "19th Century", note: "Declared St. Joseph Patron of the Universal Church on December 8, 1870 with Quemadmodum Deus." },
    { name: "Pope Leo XIII", century: "19th Century", note: "Wrote Quamquam Pluries (1889), the first papal encyclical devoted to St. Joseph, and composed the October St. Joseph prayer." },
    { name: "St. Pope John XXIII", century: "20th Century", note: "Devoted pope who placed Vatican II under St. Joseph's patronage and inserted his name into the Roman Canon of the Mass in 1962." },
    { name: "St. John Paul II", century: "20th Century", note: "Author of Redemptoris Custos (1989), highlighting St. Joseph as Guardian of the Redeemer and model of fatherhood." }
  ]
};

fs.writeFileSync(path.join(dataDir, 'devotionalExtras.json'), JSON.stringify(devotionalExtras, null, 2));
console.log('Saved devotionalExtras.json successfully');
