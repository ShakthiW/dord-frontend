import nodemailer from "nodemailer";
import { MERCHANT_REQUEST_TEMPLATE } from "@/lib/nodemailer/templates";
import { MerchantSignupPayload } from "@/global-types";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL!,
    pass: process.env.NODEMAILER_PASSWORD!,
  },
});

export const sendMerchantRequestEmail = async (
  data: MerchantSignupPayload
): Promise<void> => {
  const htmlTemplate = MERCHANT_REQUEST_TEMPLATE.replace(
    "{{businessName}}",
    data.name
  )
    .replace("{{businessEmail}}", data.businessEmail)
    .replace("{{businessPhone}}", data.businessPhone)
    .replace("{{description}}", data.description)
    .replace("{{ownerId}}", data.ownerId)
    .replace("{{slug}}", data.slug)
    .replace("{{contactName}}", data.contactName)
    .replace("{{contactEmail}}", data.contactEmail)
    .replace("{{contactPhone}}", data.contactPhone);

  const mailOptions = {
    from: `"Dord Platform" <${process.env.NODEMAILER_EMAIL}>`,
    to: process.env.DORD_SUPPORT_EMAIL,
    subject: `New Merchant Request: ${data.name}`,
    text: `New merchant request from ${data.name}. Email: ${data.businessEmail}`,
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};
