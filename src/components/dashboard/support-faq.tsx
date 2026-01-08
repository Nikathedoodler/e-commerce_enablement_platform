import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "How do I create a new order?",
    answer:
      "Navigate to Orders → Create Order. Fill in the customer information, shipping address, and add order items. The system will automatically generate an order number, or you can provide your own.",
  },
  {
    question: "How does inventory tracking work?",
    answer:
      "Inventory is automatically updated when you receive items in 'good' condition through the Receiving module. You can manually add items, update quantities, and set reorder thresholds. Low stock alerts will appear when quantity falls below the threshold.",
  },
  {
    question: "How do I connect my Shopify store?",
    answer:
      "Go to Settings → Integrations → Connect Store. Enter your Shopify store domain and authorize the connection. Once connected, orders from Shopify will automatically sync to your dashboard.",
  },
  {
    question: "What happens when I receive inventory?",
    answer:
      "When you log a receiving entry with 'good' condition items, the inventory quantity is automatically increased. If the SKU doesn't exist, a new inventory item will be created. Items in other conditions (damaged, defective, returned) are logged but don't affect inventory.",
  },
  {
    question: "How do I generate shipping labels?",
    answer:
      "Open an order detail dialog and click 'Generate Label'. Enter the package weight (required) and dimensions (optional), select the service type, and generate the label. The tracking number and cost will be saved to the order.",
  },
  {
    question: "What subscription plans are available?",
    answer:
      "We offer three plans: Starter (250 orders/month), Growth (2,000 orders/month), and Scale Pro (unlimited orders). You can view your current plan and usage limits in Settings → Billing.",
  },
  {
    question: "How do I update my profile information?",
    answer:
      "Go to Settings → Profile to update your full name and company name. These details are used throughout the platform and in communications.",
  },
  {
    question: "What should I do if I encounter an error?",
    answer:
      "If you encounter an error, try refreshing the page first. If the issue persists, use the Contact Support form on this page to report it. Include details about what you were doing when the error occurred.",
  },
];

export function SupportFAQ() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqItems.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
