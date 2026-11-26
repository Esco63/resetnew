import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-auth";
import { createSmtpTransport, getMailAddresses } from "@/lib/mail/nodemailer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const cookie = req.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_COOKIE}=`))
    ?.split("=")[1];

  if (!(await verifyAdminSession(cookie))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const transporter = createSmtpTransport();
    const { from, to, envelopeFrom } = getMailAddresses();

    await transporter.verify();
    await transporter.sendMail({
      from,
      to,
      subject: "reset. Schwerin - Nodemailer Test",
      text:
        "Das ist eine Testmail aus dem Adminbereich. Wenn diese Mail angekommen ist, funktioniert der SMTP-Versand.",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
          <h1 style="margin:0 0 12px;color:#ea580c">Nodemailer Test erfolgreich</h1>
          <p>Diese Testmail wurde aus dem Adminbereich von reset. Schwerin versendet.</p>
          <p>Wenn sie angekommen ist, funktioniert der SMTP-Versand.</p>
        </div>
      `,
      envelope: { from: envelopeFrom, to },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Mail test failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
