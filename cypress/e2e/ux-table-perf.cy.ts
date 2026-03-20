describe('UxTable 性能测试', () => {
    // Cypress 在处理 9999x9999 时，单纯生成和构建 DOM 可能会超时。
    // 因此这里需要稍微增加超时时间。
    
    // 我们这里利用 cy.window 注入脚本测量时间
    // 为了加速 Cypress 的运行效率并避免因为过大导致内存溢出奔溃，我们减小数据规模，主要验证逻辑链路和耗时对比
    // 用户实际测试的是真实应用场景，但自动化测试通常建议控制在一个合理的大规模以验证 Worker 的性能优势
    
    const measureAction = (url: string, label: string) => {
        cy.visit(url);
        // 等待表格渲染完成
        cy.get('[data-testid="ux-table-header-row"]', { timeout: 60000 }).should('exist');

        cy.window().then((win) => {
            return new Cypress.Promise((resolve) => {
                // 等待页面稳定
                setTimeout(() => {
                    // 覆盖 document.execCommand 截获拷贝完成的时机
                    const originalExecCommand = win.document.execCommand;
                    win.document.execCommand = function(cmd, ...args) {
                        if (cmd === 'copy') {
                            return true;
                        }
                        return originalExecCommand.apply(this, [cmd, ...args]);
                    };

                    const startCopy = performance.now();
                    // 直接在 body 触发事件，避免 cy.get().click() 的异步死锁
                    win.document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true }));
                    win.document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', ctrlKey: true }));
                    
                    setTimeout(() => {
                        const endCopy = performance.now();
                        cy.log(`[${label}] 复制耗时估算: ${endCopy - startCopy} ms`);
                        
                        // 模拟粘贴大规模数据
                        const pasteEvent = new win.Event('paste', { bubbles: true, cancelable: true });
                        const clipboardData = {
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            getData: (_type: string) => {
                                const rowStr = Array(100).fill('100').join('\t');
                                return Array(100).fill(rowStr).join('\n');
                            }
                        };
                         
                        // @ts-expect-error Cypress event target assignment workaround
                        pasteEvent.clipboardData = clipboardData;

                        const startPaste = performance.now();
                        win.document.querySelector('.ux-table-main')?.dispatchEvent(pasteEvent);
                        
                        setTimeout(() => {
                            const endPaste = performance.now();
                            cy.log(`[${label}] 粘贴处理耗时估算: ${endPaste - startPaste} ms`);
                            resolve(null);
                        }, 1500); // 等待粘贴处理完成
                    }, 500); // 等待拷贝处理完成
                }, 1000);
            });
        });
    };

    it('测试使用 Web Worker 在大规模数据下的复制与粘贴耗时', () => {
        measureAction('/?perf=true', 'With Worker');
    });

    it('测试不使用 Web Worker (降级主线程) 在大规模数据下的复制与粘贴耗时', () => {
        measureAction('/?perf=true&isWorker=false', 'Without Worker');
    });
});