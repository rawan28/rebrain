/**
 * Generates math problems with adaptive difficulty.
 */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMathProblem(level) {
  let a, b, op, answer, question;

  if (level <= 2) {
    // Simple addition, small numbers
    a = rand(1, 10);
    b = rand(1, 10);
    op = '+';
    answer = a + b;
    question = `${a} + ${b} = ?`;
  } else if (level <= 4) {
    // Addition/subtraction, larger numbers
    if (Math.random() > 0.5) {
      a = rand(10, 50);
      b = rand(1, 30);
      op = '+';
      answer = a + b;
      question = `${a} + ${b} = ?`;
    } else {
      a = rand(10, 50);
      b = rand(1, a);
      op = '-';
      answer = a - b;
      question = `${a} − ${b} = ?`;
    }
  } else if (level <= 6) {
    // Multiplication with small numbers
    a = rand(2, 9);
    b = rand(2, 9);
    op = '×';
    answer = a * b;
    question = `${a} × ${b} = ?`;
  } else if (level <= 8) {
    // Mixed operations, larger numbers
    const type = rand(0, 2);
    if (type === 0) {
      a = rand(10, 99);
      b = rand(10, 99);
      answer = a + b;
      question = `${a} + ${b} = ?`;
    } else if (type === 1) {
      a = rand(20, 99);
      b = rand(10, a);
      answer = a - b;
      question = `${a} − ${b} = ?`;
    } else {
      a = rand(3, 12);
      b = rand(3, 12);
      answer = a * b;
      question = `${a} × ${b} = ?`;
    }
  } else {
    // Division and harder multiplication
    if (Math.random() > 0.5) {
      b = rand(2, 12);
      answer = rand(2, 12);
      a = b * answer;
      question = `${a} ÷ ${b} = ?`;
    } else {
      a = rand(11, 25);
      b = rand(4, 15);
      answer = a * b;
      question = `${a} × ${b} = ?`;
    }
  }

  // Generate wrong options
  const offsets = shuffle([1, 2, 3, 5, 10]).slice(0, 3);
  const wrongOptions = offsets.map((off, i) => {
    const sign = i % 2 === 0 ? 1 : -1;
    const wrong = answer + off * sign;
    return wrong <= 0 ? answer + off + i + 1 : wrong;
  }).filter(v => v !== answer);

  while (wrongOptions.length < 3) {
    wrongOptions.push(answer + wrongOptions.length + 2);
  }

  const options = shuffle([answer, ...wrongOptions.slice(0, 3)]);

  return { question, answer, options };
}