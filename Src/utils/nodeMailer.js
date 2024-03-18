const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "baibhav.malaviya@gmail.com",
        pass: "wyhk tkdv kskh cupv",
    },
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: "baibhav.malaviya@gmail.com",
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Re-throw the error to propagate it further
    }
};

const sendRegistrationConfirmationEmail = async (user) => {
    const { fullName, email } = user;
    console.log("FullName: ", fullName, ", Email: ", email);

    // Prepare the email content
    const subject = "Registration Confirmation";
    const text = `Dear ${fullName},

    Thank you for registering with our platform! We're excited to have you on board.

    Your account has been created successfully. You can now log in and start exploring our services.

    If you have any questions or need assistance, feel free to reach out to our support team.

    Best regards,
    VogueLane
    `;

    try {
        await sendEmail(email, subject, text);
        console.log("Registration confirmation email sent successfully");
    } catch (error) {
        console.error("Error sending registration confirmation email:", error);
        throw error; // Re-throw the error to propagate it further
    }
};

const sendOrderConfirmationEmail = async (order) => {
    if (
        !order ||
        !order.customerName ||
        !order.customerEmail ||
        !order.orderId
    ) {
        throw new Error("Invalid order data");
    }

    const {
        fullName: customerName,
        email: customerEmail,
        _id: orderId,
    } = order;

    console.log(
        "Customer Name: ",
        customerName,
        ", Email: ",
        customerEmail,
        ", Order ID: ",
        orderId
    );

    // Prepare the email content
    const subject = "Order Confirmation";
    const text = `Dear ${customerName},

    Thank you for your order! We're processing your request, and your order will be shipped soon.

    Order ID: ${orderId}

    We'll keep you updated on the shipping status. If you have any questions or need assistance, feel free to reach out to our support team.

    Best regards,
    VogueLane
    `;

    try {
        await sendEmail(customerEmail, subject, text);
        console.log("Order confirmation email sent successfully");
    } catch (error) {
        console.error("Error sending order confirmation email:", error);
        throw error;
    }
};

module.exports = { sendEmail, sendRegistrationConfirmationEmail };
