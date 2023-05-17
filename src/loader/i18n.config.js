const i18next = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const i18nextBackend = require("i18next-fs-backend");

i18next
	.use(i18nextBackend)
	.use(i18nextMiddleware.LanguageDetector)
	.init(
		{
			fallbackLng: "en",
			lng: "en",
			preload: ["en", "fr"],
			ns: ["translation"],
			defaultNS: "translation",
			backend: {
				loadPath: "src/locales/{{lng}}/{{ns}}.json",
			},
			detection: {
				lookupHeader: "accept-language",
				order: ["header"],
			},
		},
		function (err, t) {
			// The callback function is called when i18next has finished initializing
			if (err) {
				console.log("Error initializing i18next: " + err);
			} else {
				console.log("i18next initialized successfully");
			}
		}
	);

module.exports = i18nextMiddleware.handle(i18next);
