'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  User,
  Package,
  ImageIcon,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface OnboardingOverlayProps {
  open: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const steps = [
  {
    title: 'Welcome to Stilbaai Gallery!',
    description:
      "We're excited to have you as an artist. This quick tutorial will show you how to submit your artwork for sale in our gallery.",
    icon: CheckCircle2,
    content: (
      <div className="space-y-4 text-stone-600">
        <p>In just a few steps, you&apos;ll learn how to:</p>
        <ul className="space-y-2 ml-4">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
            Complete your artist profile
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
            Submit artwork for review
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
            Track your submissions
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: 'Step 1: Complete Your Profile',
    description:
      'Before you can submit artwork, you need to complete your artist profile with your personal and banking details.',
    icon: User,
    content: (
      <div className="space-y-4 text-stone-600">
        <p>Your profile includes:</p>
        <ul className="space-y-2 ml-4">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
            <strong>Personal Details:</strong> Name, phone, and ID number
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
            <strong>Banking Details:</strong> For receiving your payouts
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
            <strong>Delivery Address:</strong> For returning unsold work
          </li>
        </ul>
        <p className="text-sm bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800">
          💡 Your banking details are kept secure and only used for payment
          processing.
        </p>
      </div>
    ),
  },
  {
    title: 'Step 2: Submit Your Artwork',
    description:
      'Once your profile is complete, you can submit as many artworks as you like for review.',
    icon: Package,
    content: (
      <div className="space-y-4 text-stone-600">
        <p>For each artwork, you&apos;ll provide:</p>
        <ul className="space-y-2 ml-4">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
            Title and description
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
            Artist name and exhibition (if applicable)
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
            Dimensions and medium
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
            Selling price
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: 'Step 3: Upload Images',
    description:
      'High-quality images help sell your artwork. Upload up to 3 images per submission.',
    icon: ImageIcon,
    content: (
      <div className="space-y-4 text-stone-600">
        <p>Image tips:</p>
        <ul className="space-y-2 ml-4">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
            Use good lighting and a clean background
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
            Show the artwork from multiple angles if possible
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
            Images are automatically optimized for the web
          </li>
        </ul>
        <p className="text-sm bg-stone-50 border border-stone-200 rounded-lg p-3">
          📷 We automatically compress images to ensure fast loading while
          maintaining quality.
        </p>
      </div>
    ),
  },
  {
    title: 'Step 4: Pricing & Payouts',
    description:
      'Set your selling price and see exactly what you will earn from each sale.',
    icon: DollarSign,
    content: (
      <div className="space-y-4 text-stone-600">
        <p>How pricing works:</p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span>Selling Price:</span>
            <span className="font-medium">R1,000.00</span>
          </div>
          <div className="flex justify-between text-green-700">
            <span>Your Payout (55%):</span>
            <span className="font-semibold">R550.00</span>
          </div>
          <div className="flex justify-between text-stone-500 text-sm">
            <span>Gallery Commission (45%):</span>
            <span>R450.00</span>
          </div>
        </div>
        <p className="text-sm">
          Payouts are processed to your registered bank account after the
          artwork sells.
        </p>
      </div>
    ),
  },
  {
    title: "You're All Set!",
    description:
      "That's everything you need to know. Start by completing your profile, then submit your first artwork!",
    icon: CheckCircle2,
    content: (
      <div className="space-y-4 text-stone-600">
        <p>What happens next:</p>
        <ol className="space-y-3 ml-4">
          <li className="flex items-start gap-3">
            <span className="shrink-0 h-6 w-6 rounded-full bg-stone-200 text-stone-700 text-sm flex items-center justify-center font-medium">
              1
            </span>
            <span>Complete your artist profile</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="shrink-0 h-6 w-6 rounded-full bg-stone-200 text-stone-700 text-sm flex items-center justify-center font-medium">
              2
            </span>
            <span>Submit your artwork for review</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="shrink-0 h-6 w-6 rounded-full bg-stone-200 text-stone-700 text-sm flex items-center justify-center font-medium">
              3
            </span>
            <span>We&apos;ll review and publish approved items</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="shrink-0 h-6 w-6 rounded-full bg-stone-200 text-stone-700 text-sm flex items-center justify-center font-medium">
              4
            </span>
            <span>Get paid when your artwork sells!</span>
          </li>
        </ol>
        <p className="text-sm bg-stone-50 border border-stone-200 rounded-lg p-3">
          💡 You can access this tutorial again anytime from the menu.
        </p>
      </div>
    ),
  },
];

export function OnboardingOverlay({
  open,
  onComplete,
  onSkip,
}: OnboardingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const progress = ((currentStep + 1) / steps.length) * 100;

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      setCurrentStep(0);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
    setCurrentStep(0);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleSkip()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center">
              <Icon className="h-5 w-5 text-stone-700" />
            </div>
            <div className="flex-1">
              <Progress value={progress} className="h-1.5" />
            </div>
            <span className="text-sm text-stone-500">
              {currentStep + 1}/{steps.length}
            </span>
          </div>
          <DialogTitle className="text-xl">{currentStepData.title}</DialogTitle>
          <DialogDescription>{currentStepData.description}</DialogDescription>
        </DialogHeader>

        <div className="py-4">{currentStepData.content}</div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            {!isFirstStep && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex-1 sm:flex-none"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            {isFirstStep && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="flex-1 sm:flex-none text-stone-500"
              >
                Skip Tutorial
              </Button>
            )}
          </div>
          <Button
            onClick={handleNext}
            className="bg-stone-900 hover:bg-stone-800 flex-1 sm:flex-none"
          >
            {isLastStep ? (
              "Let's Go!"
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
