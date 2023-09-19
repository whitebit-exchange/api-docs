import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
  <AccordionTrigger>Is it styled?</AccordionTrigger>
  <AccordionContent>
    Yes. It comes with default styles that matches the other components'
    aesthetic.
  </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
  <AccordionTrigger>Is it animated?</AccordionTrigger>
  <AccordionContent>
    Yes. It's animated by default, but you can disable it if you prefer.
  </AccordionContent>
  </AccordionItem>
</Accordion>


import { Badge } from "@/components/ui/badge";

<Badge>Badge</Badge>
<Badge variant="secondary">Badge</Badge>
<Badge variant="destructive">Badge</Badge>
<Badge variant="outline">Badge</Badge>


import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent>Place content for the popover here.</PopoverContent>
</Popover>
