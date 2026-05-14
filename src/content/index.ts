import { module1 } from './module-1';
import { module2 } from './module-2';
import { module3 } from './module-3';
import { module4 } from './module-4';
import { module5 } from './module-5';
import { moduleInterviewMs } from './module-interview-ms';
import { moduleInterviewStack } from './module-interview-stack';
import { moduleInterview3 } from './module-interview-3';
import { moduleInterview4 } from './module-interview-4';
import { moduleInterview5 } from './module-interview-5';
import { modulePracticeInterview } from './module-practice-interview';
import { moduleCvInterview } from './module-cv-interview';
import type { LectureModule } from './schema';

module1.isAvailable = true;
module1.summary = 'Core Java: JVM, память, ООП, модификаторы, String, equals/hashCode и базовые собес-вопросы.';

module2.isAvailable = true;
module2.lockedReason = undefined;

module3.isAvailable = true;
module3.lockedReason = undefined;

export const modules: LectureModule[] = [
  module1,
  module2,
  module3,
  module4,
  module5,
  modulePracticeInterview,
  moduleInterviewMs,
  moduleInterviewStack,
  moduleInterview3,
  moduleInterview4,
  moduleInterview5,
  moduleCvInterview,
];
