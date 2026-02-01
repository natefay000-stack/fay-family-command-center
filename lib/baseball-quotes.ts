// Baseball motivational quotes

export const BASEBALL_QUOTES = [
  { text: "It's hard to beat a person who never gives up.", author: "Babe Ruth" },
  { text: "Every strike brings me closer to the next home run.", author: "Babe Ruth" },
  { text: "Baseball is ninety percent mental and the other half is physical.", author: "Yogi Berra" },
  { text: "You can't be afraid to fail. It's the only way you succeed.", author: "LeBron James" },
  { text: "The only way to prove you're a good sport is to lose.", author: "Ernie Banks" },
  { text: "There may be people that have more talent than you, but there's no excuse for anyone to work harder than you.", author: "Derek Jeter" },
  { text: "It ain't over 'til it's over.", author: "Yogi Berra" },
  { text: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth" },
  { text: "Baseball was, is, and always will be to me the best game in the world.", author: "Babe Ruth" },
  { text: "The difference between the impossible and the possible lies in a man's determination.", author: "Tommy Lasorda" },
  { text: "I'd walk through hell in a gasoline suit to play baseball.", author: "Pete Rose" },
  { text: "You owe it to yourself to be the best you can possibly be.", author: "Pete Rose" },
  { text: "A winner is someone who recognizes his God-given talents, works to develop them into skills.", author: "Larry Bird" },
  { text: "You gotta be a man to play baseball for a living, but you gotta have a lot of little boy in you.", author: "Roy Campanella" },
  { text: "Baseball is the only field of endeavor where a man can succeed three times out of ten and be considered a good performer.", author: "Ted Williams" },
  { text: "Set your goals high, and don't stop till you get there.", author: "Bo Jackson" },
  { text: "The way a team plays as a whole determines its success.", author: "Babe Ruth" },
  { text: "When you're in a slump, you comfort yourself by saying, 'I'm due.'", author: "Frank Howard" },
  { text: "Little League baseball is a very good thing because it keeps the parents off the streets.", author: "Yogi Berra" },
  { text: "You can't win unless you learn how to lose.", author: "Kareem Abdul-Jabbar" },
  { text: "Champions keep playing until they get it right.", author: "Billie Jean King" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "The more I practice, the luckier I get.", author: "Gary Player" },
  { text: "Pressure is a privilege.", author: "Billie Jean King" },
  { text: "Don't let what you cannot do interfere with what you can do.", author: "John Wooden" },
  { text: "I've failed over and over again in my life. And that is why I succeed.", author: "Michael Jordan" },
  { text: "The only place success comes before work is in the dictionary.", author: "Vince Lombardi" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Today I will do what others won't, so tomorrow I can accomplish what others can't.", author: "Jerry Rice" },
  { text: "Play like you're in first, train like you're in second.", author: "Unknown" },
]

export function getRandomBaseballQuote() {
  return BASEBALL_QUOTES[Math.floor(Math.random() * BASEBALL_QUOTES.length)]
}
