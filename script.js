        const searchInput = document.getElementById("search");
        const products = document.querySelectorAll("#products .produto");
        const cart = document.getElementById("cart");
        const totalElement = document.getElementById("total");
        const checkoutBtn = document.getElementById("checkout");

        function updateTotal() {
            let total = 0;
            [...cart.children].forEach(item => {
                const price = parseFloat(item.dataset.price);
                const qty = parseInt(item.querySelector(".qty").textContent);
                total += price * qty;
            });
            totalElement.textContent = total.toFixed(2);
        }

        // Busca
        searchInput.addEventListener("keyup", function() {
            const filter = searchInput.value.toLowerCase();
            products.forEach(item => {
                if (item.textContent.toLowerCase().includes(filter)) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }
            });
        });

        // Adicionar ao carrinho
        document.querySelectorAll(".add").forEach(button => {
            button.addEventListener("click", function() {
                const productDiv = this.parentElement;
                const productName = productDiv.querySelector("h2").textContent.trim();
                const productPrice = parseFloat(productDiv.dataset.price);

                // Captura opções selecionadas
                const ram = productDiv.querySelector("select[name='ram']").value;
                const cpu = productDiv.querySelector("select[name='Processador']").value;
                const gpu = productDiv.querySelector("select[name='GPU']").value;

                let existingItem = [...cart.children].find(li => li.dataset.name === productName);

                if (existingItem) {
                    let qty = existingItem.querySelector(".qty");
                    qty.textContent = parseInt(qty.textContent) + 1;
                } else {
                    let li = document.createElement("li");
                    li.dataset.name = productName;
                    li.dataset.price = productPrice;
                    li.dataset.ram = ram;
                    li.dataset.cpu = cpu;
                    li.dataset.gpu = gpu;
                    li.innerHTML = `${productName} - R$ ${productPrice.toFixed(2)} | Quantidade: <span class="qty">1</span>
                        <br>Configuração: RAM ${ram}, CPU ${cpu}, GPU ${gpu}
                        <button class="btn plus">+</button>
                        <button class="btn minus">-</button>`;
                    cart.appendChild(li);

                    li.querySelector(".plus").addEventListener("click", function() {
                        let qty = li.querySelector(".qty");
                        qty.textContent = parseInt(qty.textContent) + 1;
                        updateTotal();
                    });

                    li.querySelector(".minus").addEventListener("click", function() {
                        let qty = li.querySelector(".qty");
                        let newQty = parseInt(qty.textContent) - 1;
                        if (newQty > 0) {
                            qty.textContent = newQty;
                        } else {
                            cart.removeChild(li);
                        }
                        updateTotal();
                    });
                }
                updateTotal();
            });
        });

        // Finalizar compra -> WhatsApp
        checkoutBtn.addEventListener("click", function() {
            let message = "Olá, gostaria de finalizar meu pedido:%0A";
            [...cart.children].forEach(item => {
                const name = item.dataset.name;
                const price = parseFloat(item.dataset.price).toFixed(2);
                const qty = item.querySelector(".qty").textContent;
                const ram = item.dataset.ram;
                const cpu = item.dataset.cpu;
                const gpu = item.dataset.gpu;
                message += `- ${name} | Quantidade: ${qty} | Preço: R$ ${price} | Configuração: RAM ${ram}, CPU ${cpu}, GPU ${gpu}%0A`;
            });
            message += `Total: R$ ${totalElement.textContent}`;
            
            const phone = "5511999999999"; // coloque o número real da empresa
            const url = `https://wa.me/${phone}?text=${message}`;
            window.open(url, "_blank");
        });