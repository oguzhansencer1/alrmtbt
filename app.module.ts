import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlarmService, Alarm } from './services/alarm.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit, OnDestroy {
  // ...existing code...

  removeAlarm(alarm: Alarm) {
    // Alarmı hem alarms hem visibleAlarms listesinden çıkar
    this.alarms = this.alarms.filter(a => a.id !== alarm.id);
    this.visibleAlarms = this.visibleAlarms.filter(a => a.id !== alarm.id);
    this.faultyMachines = this.alarms.length;
    this.workingMachines = this.totalMachines - this.faultyMachines;
    // Eğer ekranda gösterilecek alarm kalmazsa bir sonraki gruba geç
    if (this.visibleAlarms.length === 0 && this.alarms.length > 0) {
      this.nextGroup();
    }
  }
  title = 'makine-alarm-sistemiv2';
  alarms: Alarm[] = [];
  visibleAlarms: Alarm[] = [];
  totalMachines: number = 120;
  workingMachines: number = 0;
  faultyMachines: number = 0;

  // 3x3 grid için otomatik geçiş
  currentIndex: number = 0;
  autoScrollInterval: any;
  readonly GRID_SIZE = 9; // 3x3 = 9 alarm gösterilecek

  constructor(private alarmService: AlarmService) {}

  ngOnInit() {
    this.loadAlarms();
    this.startAutoScroll();
    
    // Periyodik veri güncelleme
    setInterval(() => {
      this.loadAlarms();
    }, 30000); // 30 saniyede bir güncelle
  }

  ngOnDestroy() {
    this.stopAutoScroll();
  }

  loadAlarms() {
    this.alarmService.getAlarms().subscribe((data: Alarm[]) => {
      this.alarms = data.filter(alarm =>
        alarm.faultReason?.trim() !== '' && alarm.faultTime?.trim() !== ''
      );
      
      this.faultyMachines = this.alarms.length;
      this.workingMachines = this.totalMachines - this.faultyMachines;
      
      this.updateVisibleAlarms();
    });
  }

  updateVisibleAlarms() {
    // 3x3 grid için 9'ar alarm göster
    const start = this.currentIndex;
    if (this.alarms.length <= this.GRID_SIZE) {
      // Eğer toplam alarm 9 veya daha az ise tümünü göster, boş kalan yerleri doldurmak için tekrarla
      this.visibleAlarms = [];
      for (let i = 0; i < this.GRID_SIZE; i++) {
        if (this.alarms[i % this.alarms.length]) {
          this.visibleAlarms.push(this.alarms[i % this.alarms.length]);
        }
      }
    } else {
      // 9'lu grup, gerekirse baştan ekle
      this.visibleAlarms = this.alarms.slice(start, start + this.GRID_SIZE);
      if (this.visibleAlarms.length < this.GRID_SIZE) {
        this.visibleAlarms = this.visibleAlarms.concat(
          this.alarms.slice(0, this.GRID_SIZE - this.visibleAlarms.length)
        );
      }
    }
  }

  startAutoScroll() {
    this.autoScrollInterval = setInterval(() => {
      this.nextGroup();
    }, 5000); // 5 saniyede bir değiştir
  }

  stopAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }

  nextGroup() {
    if (this.alarms.length <= this.GRID_SIZE) return;
    this.currentIndex = (this.currentIndex + this.GRID_SIZE) % this.alarms.length;
    this.updateVisibleAlarms();
  }

  formatTime(timeString: string): string {
    if (!timeString) return '';
    
    // Zaman formatını düzenle (örn: "2023-12-25 14:30:15" -> "14:30")
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return timeString;
    }
  }

  isCritical(alarm: Alarm): boolean {
    // Kritik alarm koşullarını kontrol et
    const criticalKeywords = ['motor', 'yangın', 'acil', 'kritik', 'durma', 'arıza', 'stop'];
    const reason = alarm.faultReason?.toLowerCase() || '';
    const name = alarm.name?.toLowerCase() || '';
    
    return criticalKeywords.some(keyword => 
      reason.includes(keyword) || name.includes(keyword)
    );
  }
}