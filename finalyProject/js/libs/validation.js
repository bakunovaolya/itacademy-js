function validate(target, rules) {
  if (!rules || rules.length === 0 || rules === "null") {
    return;
  }

  const targetType = target.tagName.toLowerCase();
  const targetErrorBlock = document.getElementById(`error-${target.name}`); // тег, в который выводится ошибка, создан заранее

  if (!targetErrorBlock) {
    alert(`Не найден блок ошибки для поля ${target.name}`);
    return;
  }

  rules = rules.split(","); // из строки массив
  const errors = [];
  for (const rule of rules) {
    let [type, params] = rule.split(":"); // деструктуризация
    params = params ? params.split("|") : null;

    switch (type) {
      case "not-empty": {
        switch (targetType) {
          case "input":
          case "textarea": {
            if (target.value.trim().length === 0) {
              errors.push("Поле не должно быть пустым");
            }
            break;
          }
          case "select": {
            if (!target.value) {
              errors.push("Выпадающее поле не должно быть пустым");
            }
            break;
          }
          default: {
            alert(`Тип элемента ${targetType} не обработал в валидаторе not-empty`);
          }
        }
        break;
      }
      case "email": {
        if (!/^[^@]+@\w+(\.\w+)+\w$/.test(target.value.trim())) {
          errors.push("Поле должно быть email");
        }
        break;
      }
      case "min-len": {
        const limiter = params && params[0] ? params[0] : 1;
        if (target.value.trim().length < limiter) {
          errors.push(`Поле не должно быть меньше ${limiter}`);
        }
        break;
      }
      case "range": {
        const limiter = params && params[0] ? params[0] : 1;
        const maxLevel = params && params[1] ? params[1] : 2;
        if (target.value.trim().length < limiter || target.value.trim().length > maxLevel) {
          errors.push(`Поле должно быть больше ${limiter} и меньше ${maxLevel}`);
        }
        break;
      }
      default: {
        alert(`Валидатор ${type} не найден`);
      }
    }
  }

  if (errors.length > 0) {
    targetErrorBlock.innerHTML = errors.join(", ");
    targetErrorBlock.classList.remove("hide");
    targetErrorBlock.classList.add("display-block");
  } else {
    targetErrorBlock.innerHTML = "";
    targetErrorBlock.classList.add("hide");
    targetErrorBlock.classList.remove("display-block");
  }

  return errors;
}
