import React from "react";
import Link from "next/link";

export const metadata = {
  title: "SpiñO Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-gray-100">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-semibold mb-6">SpiñO Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">
          Last updated: November 2025
        </p>

        <section className="space-y-4 mb-8">
          <p>
            This Privacy Policy explains how SpiñO ("we", "us", "our") collects,
            uses, and protects information when you use the SpiñO mobile
            application ("App") and the SpiñO web service available at{" "}
            <a
              href="https://spino-ai.com"
              className="underline text-blue-400 hover:text-blue-300"
              target="_blank"
              rel="noreferrer"
            >
              spino-ai.com
            </a>{" "}
            ("Service").
          </p>
          <p>
            By using the App or the Service, you agree to the practices
            described in this Policy.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">1. Who we are</h2>
          <p>
            SpiñO is a philosophical clarity tool built around a Spinozistic
            model of emotions and causality. The mobile App is a wrapper
            (WebView) around the web-based SpiñO experience at{" "}
            <a
              href="https://spino-ai.com"
              className="underline text-blue-400 hover:text-blue-300"
              target="_blank"
              rel="noreferrer"
            >
              spino-ai.com
            </a>
            .
          </p>
          <p>
            If you have questions about this Policy, you can contact us at:{" "}
            <a
              href="mailto:contact@spino-ai.com"
              className="underline text-blue-400 hover:text-blue-300"
            >
              contact@spino-ai.com
            </a>
            .
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">
            2. What information we collect
          </h2>
          <p>We collect two main types of information:</p>
          <h3 className="text-lg font-medium">
            a) Information you provide directly
          </h3>
          <p>
            When you use SpiñO, you may enter free-text reflections,
            descriptions of situations, and emotional states. This can include:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Text you write in the chat or forms</li>
            <li>Emotional ratings or answers to guided questions</li>
          </ul>
          <p>
            This content is processed to generate responses and to improve the
            clarity and usefulness of the Service.
          </p>
          <p className="text-sm text-gray-400">
            Important: Do not share highly sensitive personal data (such as
            full names, addresses, medical records, or identifiers of other
            people) unless strictly necessary. The Service is not intended for
            managing medical or legal records.
          </p>

          <h3 className="text-lg font-medium">
            b) Technical and usage data
          </h3>
          <p>
            When you use the App or Service, certain technical data may be
            collected automatically, such as:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>IP address and rough location (country/region)</li>
            <li>Device type, operating system, browser type</li>
            <li>Timestamps and basic usage logs</li>
            <li>Error logs and performance data</li>
          </ul>
          <p>
            This data is used to operate, secure, and improve the Service. It
            may be processed by our hosting providers or analytics tools.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">
            3. Payments and Google Play
          </h2>
          <p>
            If you purchase the SpiñO mobile app on Google Play, payment
            processing is handled by Google Play. We do not receive or store
            your full payment card details.
          </p>
          <p>
            We may receive limited information from Google Play related to your
            purchase status (for example, confirmation that you have purchased
            the app) to enable access to the App.
          </p>
          <p>
            For details on how Google handles your payment information, please
            refer to Google's own Privacy Policy and Google Play terms.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">
            4. How we use your information
          </h2>
          <p>We use the information described above for the following purposes:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>To provide and operate the SpiñO Service</li>
            <li>
              To generate responses and analyses based on your inputs
            </li>
            <li>
              To maintain the security and stability of the App and Service
            </li>
            <li>
              To understand usage patterns and improve features and performance
            </li>
            <li>
              To comply with legal obligations when required by applicable law
            </li>
          </ul>
          <p>We do not sell your personal data.</p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">5. Data sharing</h2>
          <p>We may share data with:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              Service providers who help us host, operate, or analyze the
              Service (e.g. hosting, cloud infrastructure, logging, or analytics
              providers)
            </li>
            <li>
              Legal authorities, if required by applicable law or to respond to
              valid legal requests
            </li>
          </ul>
          <p>We do not share your reflections or emotional content with advertisers.</p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">6. Data retention</h2>
          <p>
            We retain data for as long as necessary to:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Provide the Service</li>
            <li>
              Maintain reasonable records of usage and performance
            </li>
            <li>Comply with legal obligations</li>
          </ul>
          <p>
            If you wish to request deletion of your data, you can contact us at{" "}
            <a
              href="mailto:contact@spino-ai.com"
              className="underline text-blue-400 hover:text-blue-300"
            >
              contact@spino-ai.com
            </a>{" "}
            and we will make reasonable efforts to comply, subject to technical
            and legal limitations.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">7. Children's privacy</h2>
          <p>
            SpiñO is intended for adults. We do not knowingly collect personal
            information from children under the age required by local law (for
            example, 13 or 16, depending on jurisdiction).
          </p>
          <p>
            If you believe a child has provided us with personal information
            without appropriate consent, please contact us so we can take
            appropriate action.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">8. Security</h2>
          <p>
            We use reasonable technical and organizational measures to protect
            information against unauthorized access, loss, or misuse. However,
            no system can be guaranteed 100% secure. You are responsible for
            keeping your device secure and for not sharing highly sensitive data
            in the App unless necessary.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">
            9. Not medical or psychological advice
          </h2>
          <p>
            SpiñO is a philosophical and reflective tool. It is not a medical,
            psychological, or crisis service, and nothing in the App or Service
            should be considered professional medical or mental health advice.
          </p>
          <p>
            If you are in crisis or at risk of harm, please contact local
            emergency services or a qualified professional instead of relying on
            this App.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">10. Changes to this Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we
            will change the "Last updated" date at the top. Continuing to use
            the App or Service after an update means you accept the revised
            Policy.
          </p>
        </section>

        <section className="space-y-3 mb-16">
          <h2 className="text-xl font-semibold">11. Contact</h2>
          <p>
            For questions or requests related to this Policy, you can contact us
            at{" "}
            <a
              href="mailto:contact@spino-ai.com"
              className="underline text-blue-400 hover:text-blue-300"
            >
              contact@spino-ai.com
            </a>
            .
          </p>
        </section>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <Link 
            href="/" 
            className="text-blue-400 hover:text-blue-300 underline"
          >
            ← Back to SpiñO
          </Link>
        </div>
      </div>
    </main>
  );
}

