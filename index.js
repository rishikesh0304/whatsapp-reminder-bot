const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason
} = require("@whiskeysockets/baileys");

const P = require("pino");
const qrcode = require("qrcode-terminal");

const startScheduler = require("./scheduler");

const logger = require("./logger");

async function startBot() {

    const { state, saveCreds } =
        await useMultiFileAuthState("./auth");

    const { version } =
        await fetchLatestBaileysVersion();

    const sock = makeWASocket({

        version,

        auth: state,

        logger: P({
            level: "silent"
        }),

        printQRInTerminal: false,

        syncFullHistory: false,

        markOnlineOnConnect: false

    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on(

        "connection.update",

        async ({ connection, qr, lastDisconnect }) => {

            if (qr) {

                console.clear();

                console.log("Scan QR Code\n");

                qrcode.generate(qr, {
                    small: true
                });

            }

            if (connection === "open") {

                logger.info("WhatsApp Connected");

                startScheduler(sock);

            }

            if (connection === "close") {

                logger.warn("WhatsApp Disconnected");

                const shouldReconnect =
                    lastDisconnect?.error?.output?.statusCode !==
                    DisconnectReason.loggedOut;

                if (shouldReconnect) {

                    logger.info("Reconnecting...");

                    startBot();

                } else {

                    logger.error(
                        "Logged Out. Delete auth folder and login again."
                    );

                }

            }

        }

    );

}

startBot();