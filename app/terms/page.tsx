import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function Terms() {
    return (
        <div className="w-full flex justify-center p-10">
            <div className="w-full max-w-screen-md space-y-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 underline"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Chatbot
                </Link>

                <h1 className="text-3xl font-bold">PCOS Companion</h1>
                <h2 className="text-2xl font-semibold">Terms of Use / Disclaimer</h2>

                <p className="text-gray-700">
                    These Terms of Use govern your access to and use of PCOS Companion, an 
                    AI-powered educational assistant created by Ankita and Saba (BITSoM MBA ’26) 
                    (“we”, “our”, “us”). By using this assistant, you agree to these terms. 
                    If you do not agree, do not use the service.
                </p>

                {/* 1. Purpose and Nature */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">1. Purpose and Nature of the Service</h3>
                    <p className="text-gray-700">
                        PCOS Companion is an educational and lifestyle-support AI designed to help 
                        users better understand PCOS-related concepts, general wellness principles, 
                        behavioural strategies, and everyday routines.
                    </p>
                    <p className="text-gray-700">
                        It is not a medical service and does not provide diagnosis, treatment, or medical advice.
                        The assistant is not affiliated with any medical institution, clinic, or healthcare provider.
                    </p>
                </div>

                {/* 2. Not Medical Advice */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">2. Not Medical Advice</h3>
                    <p className="text-gray-700">
                        PCOS Companion is not a doctor, healthcare professional, or licensed provider.
                        Therefore, it cannot diagnose conditions, interpret lab results, recommend or adjust 
                        medication/supplements, or replace professional medical consultation.
                    </p>
                    <p className="text-gray-700">
                        All information is general and educational. Always consult a qualified medical 
                        professional before acting on any health-related information.
                    </p>
                </div>

                {/* 3. Accuracy */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">3. Accuracy and Limitations</h3>
                    <p className="text-gray-700">
                        The assistant may sometimes generate incomplete, incorrect, or outdated information.
                        We make no promises about accuracy, reliability, completeness, or suitability for 
                        any particular purpose. Use the service at your own discretion and risk.
                    </p>
                </div>

                {/* 4. User Eligibility */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">4. User Eligibility & Responsibilities</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>You are at least 18 years old.</li>
                        <li>You will not rely on the assistant for medical, legal, financial, or emergency decisions.</li>
                        <li>You will not input harmful, abusive, or illegal content.</li>
                        <li>You will not attempt to reverse engineer, disrupt, or misuse the service.</li>
                    </ul>
                </div>

                {/* 5. Data Privacy */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">5. Data, Privacy, and Storage</h3>
                    <p className="text-gray-700">
                        PCOS Companion uses third-party AI platforms to generate responses. As a result:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Your inputs may be transmitted to external servers.</li>
                        <li>Privacy or confidentiality cannot be guaranteed.</li>
                        <li>Do not share sensitive personal information.</li>
                        <li>Your conversations may be reviewed to improve the service.</li>
                    </ul>
                </div>

                {/* 6. Ownership */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">6. Ownership of Inputs and Outputs</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Your inputs and generated outputs may be stored or analyzed to improve the product.</li>
                        <li>You waive any intellectual property claims over content you provide or receive.</li>
                        <li>We may use anonymized content for research or product enhancement.</li>
                        <li>You are responsible for ensuring your inputs do not violate IP rights.</li>
                    </ul>
                </div>

                {/* 7. Limitation of Liability */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">7. Limitation of Liability</h3>
                    <p className="text-gray-700">
                        The service is provided “as is” and “as available.” We disclaim all warranties, including 
                        fitness for a particular purpose. We are not liable for any damages—including direct, 
                        indirect, incidental, or consequential losses—related to your use of the assistant or 
                        decisions made based on AI-generated content.
                    </p>
                </div>

                {/* 8. Modifications */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">8. Service Modifications</h3>
                    <p className="text-gray-700">
                        We may modify, suspend, or discontinue the assistant at any time without notice. 
                        We may also introduce paid plans or usage limits in the future.
                    </p>
                </div>

                {/* 9. Governing Law */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">9. Governing Law</h3>
                    <p className="text-gray-700">
                        These terms are governed by the laws of India. Any disputes arising from this service 
                        will fall under the jurisdiction of the courts located in Mumbai, Maharashtra.
                    </p>
                </div>

                {/* 10. Acceptance */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">10. Acceptance</h3>
                    <p className="text-gray-700">
                        By continuing to use PCOS Companion, you acknowledge that you have read and understood 
                        the Terms of Use and agree to all conditions outlined above.
                    </p>
                </div>

                {/* Timestamp */}
                <div className="mt-8 text-sm text-gray-600">
                    <p>Last Updated: November 2025</p>
                </div>
            </div>
        </div>
    );
}
