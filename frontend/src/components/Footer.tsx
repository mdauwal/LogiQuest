const sections = [
  {
    heading: "Game Modes",
    links: [
      "Classic Mode",
      "Challenge Mode",
      "Multiplayer Mode",
      "Daily Challenge",
      "Themed Quests",
      "Timed Blitz",
      "Puzzle Mode",
      "Practice Mode",
      "Adventure Mode",
    ],
  },
  {
    heading: "Info",
    links: ["FAQs", "Pricing", "Status", "Blog", "Policy"],
  },
];

const socialMedia = [
  {
    name: "Linkedin",
    path: "/linkedin.png",
  },
  {
    name: "Twitter",
    path: "/twitter.png",
  },
  {
    name: "Github",
    path: "/github.png",
  },
];

const footerLinks = [
  "About us",
  "Terms & Conditions",
  "Contact us",
  "Privacy policy",
];

export default function Footer() {
  return (
    <footer className="bg-[#141516] w-full text-white" role="contentinfo">
      <section className="flex justify-between h-[506px] pr-20">
        {/* Logo */}
        <div className="flex items-center justify-center w-[390px] h-[156.8px] gap-[11px] self-center">
          <img
            src="/logo.png"
            alt="LogiQuest Logo"
            className="object-contain w-full h-full"
            aria-label="LogiQuest Logo"
          />
          <p className="text-[#CFFDED] text-[31px] leading-[46.87px] font-bold">
            LogiQuest
          </p>
        </div>

        {/* Game Mode && Info */}
        <div className="flex gap-[26px]">
          {sections.map((section) => (
            <article
              key={section.heading}
              className="flex flex-col gap-[14px] w-[208px] mt-[113px]"
              aria-labelledby={`${section.heading
                .toLowerCase()
                .replace(/\s+/g, "-")}-heading`}
            >
              <h2
                id={`${section.heading
                  .toLowerCase()
                  .replace(/\s+/g, "-")}-heading`}
                className="text-xl font-bold"
              >
                {section.heading}
              </h2>
              <nav aria-label={`${section.heading} links`}>
                <ul className="h-[318px] text-left flex flex-col gap-[10px]">
                  {section.links.map((current) => (
                    <li key={current}>
                      <a
                        href="#"
                        className="py-[6px] px-[10px] hover:text-gray-400"
                      >
                        {current}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </article>
          ))}
        </div>

        {/* Newsletter */}
        <article aria-labelledby="newsletter-heading" className="mt-[113px]">
          <div className="w-[489px] text-center">
            <h2 id="newsletter-heading" className="text-2xl font-bold mb-4">
              Newsletter
            </h2>

            <p className="mb-6 font-light text-left w-[347px]">
              Subscribe to our weekly newsletter dose for updated, Tips, Helps
              Info and exclusive offers.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Subscribed!");
              }}
              className="flex gap-[10px]"
              aria-label="Newsletter subscription form"
            >
              <label htmlFor="email" className="sr-only">
                Your email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Your email"
                required
                className="w-full bg-transparent px-4 border-2 border-white rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Enter your email address"
              />
              <button
                type="submit"
                className="w-full bg-[#033330] text-white p-[10px] rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Subscribe to newsletter"
              >
                Subscribe now
              </button>
            </form>

            <div
              className="flex mt-[13px] mb-[31px] gap-[22px]"
              aria-label="Social media links"
            >
              {socialMedia.map((social) => (
                <a
                  href="#"
                  key={social.name}
                  className="h-[24px] w-[24px] hover:opacity-80"
                >
                  <img
                    src={social.path}
                    alt={social.name}
                    aria-label={`Follow us on ${social.name}`}
                  />
                </a>
              ))}
            </div>

            <div className="flex space-x-4" aria-label="Download links">
              <a
                href="https://www.apple.com/app-store"
                aria-label="Download on the App Store"
                className="hover:opacity-80 flex gap-[10px] items-center p-[10px] border rounded-[10px] w-[146px] h-[44px]"
              >
                <img
                  src="/apple.png"
                  alt="App Store"
                  className="h-[24px] w-[24px]"
                />
                <p>App Store</p>
              </a>
              <a
                href="https://play.google.com/store"
                aria-label="Get it on Google Play"
                className="hover:opacity-80 flex gap-[10px] items-center p-[10px] border rounded-[10px] w-[146px] h-[44px]"
              >
                <img
                  src="/google.png"
                  alt="Google Play"
                  className="h-[24px] w-[24px]"
                />
                <p>Google Play</p>
              </a>
            </div>
          </div>
        </article>
      </section>

      {/* Divider */}
      <hr className="bg-white h-[2px] w-full" aria-hidden="true" />

      {/* Footer Links */}
      <div className="flex h-[63px] justify-evenly items-center text-[12px] leading-[18.14px]">
        <p>
          Copyright &copy; {new Date().getFullYear()} LogiQuest All Rights
          Reserved
        </p>
        <nav aria-label="Footer links">
          <div className="flex gap-[35px]">
            {footerLinks.map((link) => (
              <a href="#" key={link} className="hover:text-gray-400">
                {link}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </footer>
  );
}
