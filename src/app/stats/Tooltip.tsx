import {
  arrow,
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { useRef, useState } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef<HTMLDivElement>(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: 'start',
      }),
      shift(),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      <span ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </span>
      <FloatingPortal>
        {isOpen && (
          <div
            className='bg-gray-800 text-white px-4 py-3 rounded-lg text-sm max-w-sm relative'
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {content}
            <div
              ref={arrowRef}
              className='absolute w-2 h-2 bg-gray-800 rotate-45'
              style={{
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: '-4px',
              }}
            />
          </div>
        )}
      </FloatingPortal>
    </>
  );
}

export function QuestionMarkTooltip({ content }: { content: React.ReactNode }) {
  return (
    <Tooltip content={content}>
      <InformationCircleIcon className='h-4 w-4 inline-block ml-1 text-white hover:text-beige-hover transition-colors duration-300' />
    </Tooltip>
  );
}
